import TablaCliente from "./components/TablaCliente";

export default function App() {
  return (
    <div className="flex h-screen">
  <div className="w-[80%] p-4 overflow-auto">
    <TablaCliente />
  </div>
  <div className="w-[20%] p-4 text-2xl text-red-600 bg-gray-50 flex items-center justify-center">
  Panel derecho
</div>
<div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
  <img class="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
  <div>
    <div class="text-xl font-medium text-black dark:text-white">ChitChat</div>
    <p class="text-gray-500 dark:text-gray-400">You have a new message!</p>
  </div>
</div>



</div>

  );
}
