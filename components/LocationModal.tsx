"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  MapPin, Plus, Navigation, Clock, Target, Home, Building, Search,
  Check, X, Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

// --------------------
// Interfaces
// --------------------
interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  pincode: string;
  type?: "home" | "work" | "other";
}

type DetectedAddress = {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  formatted: string;
  accuracy: number; // Keep accuracy to show the user
};

const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi"
];

const manualAddressSchema = z.object({
  houseNumber: z.string().min(1, "House/Building number is required"),
  buildingName: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit pincode"),
  landmark: z.string().optional(),
});

type ManualAddressForm = z.infer<typeof manualAddressSchema>;

// --------------------
// Component
// --------------------
export const LocationModal = ({ isOpen, onClose, onLocationSelect }: LocationModalProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("quick");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [recentSearches] = useState<string[]>([
    "Koramangala, Bangalore",
    "Indiranagar, Bangalore",
    "HSR Layout, Bangalore",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<DetectedAddress | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Use a ref to keep track of the watcher, preventing re-render issues
  const watchIdRef = useRef<number | null>(null);

  const form = useForm<ManualAddressForm>({
    resolver: zodResolver(manualAddressSchema),
    defaultValues: {
      houseNumber: "", buildingName: "", street: "", area: "",
      city: "", state: "", pincode: "", landmark: "",
    },
  });
  
  // --------------------
  // Cleanup function to stop watching
  // --------------------
  const stopWatchingLocation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  useEffect(() => {
    // Ensure we stop watching when the component unmounts or the modal closes
    return () => {
      stopWatchingLocation();
    };
  }, []);

  // --------------------
  // Fetch saved addresses
  // --------------------
  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setSavedAddresses(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not fetch saved addresses.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen && session?.user) {
      fetchAddresses();
    }
  }, [isOpen, session]);

  // --------------------
  // Reverse geocoding
  // --------------------
  const reverseGeocode = async (lat: number, lon: number) => {
    // ... (This function remains unchanged)
    try {
      const url = "https://nominatim.openstreetmap.org/reverse";
      const params = new URLSearchParams({
        lat: lat.toString(), lon: lon.toString(), format: "json", addressdetails: "1",
      });
      const response = await fetch(`${url}?${params}`, { headers: { "User-Agent": "TastyDash/1.0" } });
      if (!response.ok) throw new Error("Reverse geocoding failed");

      const data = await response.json();
      const addr = data.address || {};
      return {
        street: [addr.road, addr.suburb || addr.neighbourhood].filter(Boolean).join(", ") || "",
        city: addr.city || addr.town || addr.village || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        country: addr.country || "India",
        formatted: data.display_name || "Current Location",
      };
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return {
        street: "", city: "", state: "", pincode: "", country: "India",
        formatted: "Detected Location",
      };
    }
  };

  // --------------------
  // Detect GPS location (ROBUST "SINGLE WATCH WITH REFINEMENT" STRATEGY)
  // --------------------
  const handleDetectLocation = () => {
    if (isDetecting) return;
    
    // Reset previous state
    setDetectedAddress(null);
    setShowConfirmation(false);
    setIsDetecting(true);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your address manually.",
        variant: "destructive",
      });
      setActiveTab("manual");
      setIsDetecting(false);
      return;
    }

    // Master timeout for the whole operation
    const masterTimeout = setTimeout(() => {
      stopWatchingLocation();
      if (!detectedAddress) { // Only show error if we never got a single fix
        toast({
          title: "Location detection timed out",
          description: "Could not find your location. Please check your signal or enter manually.",
          variant: "destructive",
        });
        setIsDetecting(false);
        setActiveTab("manual");
      }
    }, 15000); // 15-second master timeout

    let isFirstUpdate = true;

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newAddress = await reverseGeocode(latitude, longitude);

        if (isFirstUpdate) {
          isFirstUpdate = false;
          setIsDetecting(false); // We have a result, so stop the main "detecting" spinner
          setShowConfirmation(true);
        }
        
        // Always update the address state to show the latest, most accurate result
        setDetectedAddress({ ...newAddress, accuracy });

        // If we get a "good enough" location, stop the process.
        if (accuracy <= 30) {
          clearTimeout(masterTimeout);
          stopWatchingLocation();
        }
      },
      (error) => {
        clearTimeout(masterTimeout);
        stopWatchingLocation();
        setIsDetecting(false);

        console.error("Geolocation error:", error);
        let message = "Could not detect your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access denied. Please allow access in your browser settings.";
        }
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        });
        setActiveTab("manual");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Max time for each update attempt
        maximumAge: 0,    // Force a fresh reading every time
      }
    );
  };
  
  // --------------------
  // Confirm GPS location
  // --------------------
  const handleConfirmLocation = async () => {
    stopWatchingLocation(); // Important: stop watching once confirmed
    if (!detectedAddress || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const streetCombined = detectedAddress.street || detectedAddress.formatted;

      const duplicate = savedAddresses.some(
        (addr) =>
          addr.address.toLowerCase() === streetCombined.toLowerCase() &&
          addr.pincode === detectedAddress.pincode
      );
      if (duplicate) {
        toast({
          title: "Address already exists",
          description: "You already have this location saved.",
          variant: "destructive",
        });
        return;
      }

      const body = {
        label: "current",
        street: streetCombined,
        city: detectedAddress.city,
        state: detectedAddress.state,
        pincode: detectedAddress.pincode,
        country: detectedAddress.country,
        isDefault: true,
      };

      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      toast({
        title: "Location saved",
        description: "Your current location has been added successfully.",
        variant: "default",
      });

      await fetchAddresses();
      onLocationSelect(`${body.street}, ${body.pincode}`);
      setShowConfirmation(false);
      setDetectedAddress(null);
    } catch (error: any) {
      console.error("Confirm location failed:", error);
      toast({
        title: "Error",
        description: error?.message || "Could not save address. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------
  // Manual address submit
  // --------------------
  const onManualAddressSubmit = async (data: ManualAddressForm) => {
    // ... (This function remains unchanged)
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const streetCombined = `${data.houseNumber}${data.buildingName ? `, ${data.buildingName}` : ""}, ${data.street}, ${data.area}`;

      const duplicate = savedAddresses.some(
        (addr) =>
          addr.address.toLowerCase() === streetCombined.toLowerCase() &&
          addr.pincode === data.pincode
      );
      if (duplicate) {
        toast({
          title: "Address already exists",
          description: "You already have this address saved.",
          variant: "destructive",
        });
        return;
      }

      const body = {
        label: "home",
        street: streetCombined,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: "India",
        isDefault: true,
      };

      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save address");

      await fetchAddresses();
      toast({
        title: "✅ Address added successfully",
        description: "Your manual address has been saved.",
      });

      onLocationSelect(`${body.street}, ${body.city}, ${body.state} - ${body.pincode}`);
      form.reset();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "Could not save address. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------
  // Helpers
  // --------------------
  const handleRejectLocation = () => {
    stopWatchingLocation(); // Important: stop watching if user rejects
    setShowConfirmation(false);
    setDetectedAddress(null);
    setActiveTab("manual");
  };

  const handleAddressSelect = (address: SavedAddress) => {
    onLocationSelect(`${address.address}, ${address.pincode}`);
    onClose();
  };

  const getAddressIcon = (type?: string) => {
    switch (type) {
      case "home": return <Home className="h-4 w-4" />;
      case "work": return <Building className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

    //
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-hidden p-0 bg-gradient-to-b from-background to-muted/20">
                <div className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="flex items-center space-x-3 text-xl">
                            <div className="p-2 rounded-full bg-primary/10">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold">
                                Choose Location
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Select your delivery location for accurate service and faster delivery
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* --- UPDATED GPS CONFIRMATION UI --- */}
                    {showConfirmation && detectedAddress ? (
                        <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2">
                            <Card className="p-5 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg">
                                <div className="flex items-start space-x-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Target className="h-5 w-5 text-primary animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-base mb-1">Location Detected</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {detectedAddress.formatted}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center">
                                            <div 
                                                className={cn(
                                                    "w-2 h-2 rounded-full mr-2",
                                                    detectedAddress.accuracy <= 30 ? "bg-green-500" : "bg-yellow-500",
                                                    watchIdRef.current && "animate-pulse"
                                                )}
                                            ></div>
                                            Accuracy: ~{Math.round(detectedAddress.accuracy)} meters.
                                            {watchIdRef.current && detectedAddress.accuracy > 30 && (
                                                <span className="ml-1"> (Improving...)</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 hover:bg-muted transition-colors"
                                    onClick={handleRejectLocation}
                                    disabled={isSubmitting}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Change
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                                    onClick={handleConfirmLocation}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Confirm Location
                                      </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                      // ... The rest of the JSX for Tabs remains unchanged
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger
                                    value="quick"
                                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Quick Select
                                </TabsTrigger>
                                <TabsTrigger
                                    value="manual"
                                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Manual Entry
                                </TabsTrigger>
                            </TabsList>

                            {/* Quick Select */}
                            <TabsContent value="quick" className="space-y-6 mt-6">
                                {/* Current Location Button */}
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className={cn(
                                        "w-full justify-start h-14 border-2 transition-all duration-300",
                                        "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                                        "bg-gradient-to-r from-primary/5 to-secondary/5",
                                        isDetecting && "animate-pulse border-primary/50"
                                    )}
                                    onClick={handleDetectLocation}
                                    disabled={isDetecting}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={cn(
                                            "p-2 rounded-full transition-colors",
                                            isDetecting ? "bg-primary/20" : "bg-primary/10"
                                        )}>
                                            {isDetecting ? (
                                                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                            ) : (
                                                <Navigation className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium">
                                                {isDetecting ? "Detecting your location..." : "Use current location"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                GPS location for instant delivery
                                            </div>
                                        </div>
                                    </div>
                                </Button>

                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search for area, street name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-12 border-2 focus:border-primary/50 transition-colors"
                                    />
                                </div>

                                {/* Saved Addresses */}
                                {savedAddresses.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                                            <div className="w-4 h-px bg-muted-foreground/30 mr-2"></div>
                                            Saved Addresses
                                            <div className="flex-1 h-px bg-muted-foreground/30 ml-2"></div>
                                        </h3>
                                        <div className="space-y-2">
                                            {savedAddresses.map((address) => (
                                                <Card
                                                    key={address.id}
                                                    className="p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5"
                                                    onClick={() => handleAddressSelect(address)}
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                                                            {getAddressIcon(address.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-semibold text-sm text-foreground mb-1 flex items-center">
                                                                {address.label}
                                                                <div className="ml-2 px-2 py-1 text-xs bg-muted rounded-full">
                                                                    {address.type || 'other'}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {address.address}, {address.pincode}
                                                            </div>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <div className="w-4 h-px bg-muted-foreground/30 mr-2"></div>
                                            Recent Searches
                                            <div className="flex-1 h-px bg-muted-foreground/30 ml-2"></div>
                                        </h3>
                                        <div className="space-y-2">
                                            {recentSearches.map((loc, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center space-x-4 p-3 rounded-xl cursor-pointer hover:bg-muted/50 transition-all duration-200 group"
                                                    onClick={() => onLocationSelect(loc)}
                                                >
                                                    <div className="p-1.5 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                                                        <Clock className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                                                    </div>
                                                    <span className="text-sm flex-1">{loc}</span>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Manual Entry */}
                            <TabsContent value="manual" className="space-y-6 mt-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onManualAddressSubmit)} className="space-y-5">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="houseNumber" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">House/Flat No. *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="A-101, 2nd Floor"
                                                            className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="buildingName" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Building Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Tower A, Prestige Apartments"
                                                            className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <FormField control={form.control} name="street" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Street Address *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Street name, road number"
                                                        className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="area" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Area/Locality *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Koramangala 5th Block, Sector 15"
                                                        className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="city" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">City *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Bangalore, Mumbai"
                                                            className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="pincode" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Pincode *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="560095"
                                                            maxLength={6}
                                                            className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <FormField control={form.control} name="state" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">State *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 border-2 focus:border-primary/50 transition-colors">
                                                            <SelectValue placeholder="Select your state" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {states.map((state) => (
                                                            <SelectItem key={state} value={state} className="hover:bg-primary/5">
                                                                {state}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="landmark" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Landmark (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Near Metro Station, Opposite Mall"
                                                        className="h-11 border-2 focus:border-primary/50 transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300 hover:shadow-xl"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Address
                                        </Button>

                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};