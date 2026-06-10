import WorkoutsForm from "@/components/layout/WorkoutsForm";
import { RunChart } from "@/components/layout/RunChart";
import { GymChart } from "@/components/layout/GymChart";
import { WorkoutTable } from "@/components/layout/WorkoutTable";
import { Button } from "@/components/ui/button";
export default function Workouts() {
  function HandleStravaConnection() {
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID;

    const redirectUri = "http://localhost:5173/strava/callback";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      approval_prompt: "force",
      scope: "read,activity:read_all",
    });
    window.location.href = `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-24">
      <section className="flex justify-center">
        <h1 className="text-2xl font-bold gap-2 items-center flex">
          Diario Allenamenti
        </h1>
      </section>
      <section className="flex items-center justify-between gap-4">
        <WorkoutsForm />
        <Button
          type="button"
          className="h-11 overflow-hidden p-0"
          onClick={HandleStravaConnection}
        >
          <img
            src="/icons/btn_strava_connect_with_orange_x2.svg"
            alt="Collega con Strava"
            className="block h-full w-full"
          />
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <RunChart />
        <GymChart />
      </section>
      <section>
        <WorkoutTable />
      </section>
    </main>
  );
}
