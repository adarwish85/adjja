import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { StudentCheckInModal } from "./StudentCheckInModal";
export const StudentCheckInButton = () => {
  const [showModal, setShowModal] = useState(false);
  return <>
      <Button onClick={() => setShowModal(true)} size="lg" className="bg-bjj-red hover:bg-bjj-red/90 shadow-lg whitespace-nowrap bg-stone-950 hover:bg-stone-800 text-stone-50">
        <CheckCircle className="h-5 w-5 mr-2" />
        Check In to Class
      </Button>

      <StudentCheckInModal open={showModal} onOpenChange={setShowModal} />
    </>;
};