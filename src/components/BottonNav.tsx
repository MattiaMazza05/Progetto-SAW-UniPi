import { Button } from "./ui/button";
import { ListChecks, PencilRuler, Gauge } from 'lucide-react';

export function BottomNav(){
    return(
        <nav className="fixed bottom-4 left-4 right-4 bg-background md:hidden items-center flex justify-around">
            <Button  size="icon-lg"variant="outline" >
                <Gauge />
            </Button>
            <Button size="icon-lg" variant="outline">
                <PencilRuler /> 
            </Button>
            <Button size="icon-lg" variant="outline">               
                <ListChecks />
            </Button>
        </nav>
    )
}