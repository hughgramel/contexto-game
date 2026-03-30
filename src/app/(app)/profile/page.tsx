import { OnboardingControls } from "@/components/onboarding-controls";
import { OnboardingStatus } from "@/components/onboarding-status";

export default function ProfilePage() {
  return (
    <section>
      <h1>Profile</h1>
      <p>Use these controls to verify local persisted onboarding flags.</p>
      <OnboardingControls />
      <OnboardingStatus />
    </section>
  );
}
