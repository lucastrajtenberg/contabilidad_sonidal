import TablaCliente from "./components/TablaCliente";

export default function App() {
  return (
    
    <div className="flex h-screen">
      <div className="w-[20%] p-4 text-2xl text-red-600 bg-red-100 flex items-center justify-center">
        Panel izquierdo
      </div>
      <div className="w-[80%] p-4 overflow-auto">
        <TablaCliente />
      </div>
    </div>
  );
}
