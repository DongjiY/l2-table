import { NumberTable } from "./Table";

export default function Home() {
  return (
    <div>
      <h1 className="font-bold text-2xl py-4">NextJS</h1>
      <div className="w-full flex justify-center">
        <NumberTable />
      </div>
    </div>
  );
}
