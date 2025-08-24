// app/page.jsx
import ProfileCard from "@/components/ProfileCard";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <ProfileCard
        role="UI/UX Developer"
        name="Akhil Govind"
        quote="Working at Foodyes allows me to be part of a team that is revolutionizing the food delivery industry."
        image="/earl-grey-tea.png" // ✅ match prop name
      />
    </main>
  );
}
