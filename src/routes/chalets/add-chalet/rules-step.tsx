import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Key, 
  Dog, 
  CigaretteOff, 
  PartyPopper,
  Users,
  UtensilsCrossed,
  AlertTriangle 
} from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";

interface RulesStepProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

interface Rule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const RulesStep: React.FC<RulesStepProps> = ({ setCurrentStep }) => {
  const DEFAULT_RULES: Rule[] = [
    {
      id: "check-in-out",
      title: "Check-in/Check-out Times",
      description: "Check-in: 12:00 Noon. Reception check-in with pass issued. Check-out: 10:00 AM.",
      icon: Clock
    },
    {
      id: "pass-policy",
      title: "Pass and Security",
      description: "Display pass on dashboard. Return pass to Gate Security upon departure.",
      icon: Key
    },
    {
      id: "inventory-check",
      title: "Inventory Procedure",
      description: "Maid/steward will escort and verify inventory on arrival and departure.",
      icon: AlertTriangle
    },
    {
      id: "catering-policy",
      title: "Catering Restrictions",
      description: "No outside caterers. Lodge can cater for group functions. Each chalet has specific crockery.",
      icon: UtensilsCrossed
    },
    {
      id: "occupancy-limit",
      title: "Occupancy Policy",
      description: "Maximum occupancy is limited to specified beds. No extra mattresses or bed sharing.",
      icon: Users
    },
    {
      id: "noise-policy",
      title: "Noise and Disturbance",
      description: "No loud music. Avoid undue disturbances. Respect other residents.",
      icon: PartyPopper
    },
    {
      id: "facility-rules",
      title: "Facility Usage Rules",
      description: "Specific rules for tennis courts, swimming pool, and other amenities. Supervised children activities available.",
      icon: Dog
    },
    {
      id: "smoking-policy",
      title: "Smoking and Fire Policy",
      description: "No smoking. Fires only in designated areas. No firewood provided.",
      icon: CigaretteOff
    }
  ];

  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState<string>("");

  const toggleRule = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Chalet Rules & Policies</CardTitle>
        <CardDescription>Select and Confirm Rental Policies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {DEFAULT_RULES.map((rule) => {
              const Icon = rule.icon;
              const isSelected = selectedRules.includes(rule.id);
              
              return (
                <div 
                  key={rule.id} 
                  className="flex items-center space-x-3 border p-3 rounded-lg"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <div className="flex items-center space-x-3">
                    <Icon className="size-6" />
                    <div>
                      <h4 className="font-semibold">{rule.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <Label>Additional Custom Rules (Optional)</Label>
            <Textarea
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              placeholder="Add any additional specific rules or policies for your chalet"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setCurrentStep(4)}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          <Button
            onClick={() => setCurrentStep(7)}
            disabled={selectedRules.length === 0}
             className="h-10 bg-[#27534c] hover:bg-[#1a3733]"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};