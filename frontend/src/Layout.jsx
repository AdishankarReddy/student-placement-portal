import Navbar from "./components/Navbar";

export default function Layout({children}){
    return <div className="h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1">
            {children}
        </main>
    </div>
}