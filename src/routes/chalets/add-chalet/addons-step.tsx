import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2,
  Edit,
  X,
  Utensils, 
  Bed, 
  Paintbrush, 
  CupSoda 
} from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface AddonsStepProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

export const AddonsStep: React.FC<AddonsStepProps> = ({ setCurrentStep }) => {
  const PRESET_ICONS = [Utensils, Bed, Paintbrush, CupSoda];

  const [addons, setAddons] = useState<Addon[]>([
    { id: 'breakfast', name: 'Breakfast', price: 1950 },
    { id: 'lunch', name: 'Lunch', price: 2300 },
    { id: 'dinner', name: 'Dinner', price: 2300 },
  ]);

  const [newAddon, setNewAddon] = useState<{ name: string; price: string }>({
    name: '',
    price: ''
  });

  const [isAddingAddon, setIsAddingAddon] = useState(false);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [editAddon, setEditAddon] = useState<{ name: string; price: string }>({
    name: '',
    price: ''
  });

  const addNewAddon = () => {
    if (!newAddon.name || !newAddon.price) return;

    const newAddonItem: Addon = {
      id: `custom-${Date.now()}`,
      name: newAddon.name,
      price: parseFloat(newAddon.price)
    };

    setAddons(prev => [...prev, newAddonItem]);
    setNewAddon({ name: '', price: '' });
    setIsAddingAddon(false);
  };

  const removeAddon = (id: string) => {
    setAddons(prev => prev.filter(addon => addon.id !== id));
  };

  const startEditingAddon = (addon: Addon) => {
    setEditingAddonId(addon.id);
    setEditAddon({
      name: addon.name,
      price: addon.price.toString()
    });
  };

  const saveEditedAddon = () => {
    if (!editAddon.name || !editAddon.price) return;

    setAddons(prev => 
      prev.map(addon => 
        addon.id === editingAddonId 
          ? { 
              ...addon, 
              name: editAddon.name, 
              price: parseFloat(editAddon.price) 
            }
          : addon
      )
    );
    setEditingAddonId(null);
  };

  const cancelEditing = () => {
    setEditingAddonId(null);
    setEditAddon({ name: '', price: '' });
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Addon Management</CardTitle>
        <CardDescription>Add or Remove Additional Services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {addons.map((addon, index) => {
            const Icon = PRESET_ICONS[index % PRESET_ICONS.length];
            
            // Editing mode for this specific addon
            if (addon.id === editingAddonId) {
              return (
                <div key={addon.id} className="border rounded-lg p-4 grid gap-2">
                  <Input
                    placeholder="Addon Name"
                    value={editAddon.name}
                    onChange={(e) => setEditAddon(prev => ({ 
                      ...prev, 
                      name: e.target.value 
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={editAddon.price}
                    onChange={(e) => setEditAddon(prev => ({ 
                      ...prev, 
                      price: e.target.value 
                    }))}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={saveEditedAddon} 
                      className="w-full"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelEditing} 
                      className="w-full"
                    >
                      <X className="mr-2" /> Cancel
                    </Button>
                  </div>
                </div>
              );
            }

            // Normal display mode
            return (
              <div 
                key={addon.id} 
                className="border rounded-lg overflow-hidden relative"
              >
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-32 w-full gap-2"
                >
                  {/* <Icon className="size-10" /> */}
                  <div className="text-center">
                    <div>{addon.name}</div>
                    <div className="text-sm text-muted-foreground">
                      KES {addon.price}
                    </div>
                  </div>
                </Button>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    // variant="outline"
                    size="icon"
                    className="size-6 bg-emerald-800"
                    onClick={() => startEditingAddon(addon)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-6"
                    onClick={() => removeAddon(addon.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {isAddingAddon && (
            <div className="border rounded-lg p-4 grid gap-2">
              <Input
                placeholder="Addon Name"
                value={newAddon.name}
                onChange={(e) => setNewAddon(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newAddon.price}
                onChange={(e) => setNewAddon(prev => ({ 
                  ...prev, 
                  price: e.target.value 
                }))}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={addNewAddon} 
                  className="w-full"
                >
                  Save Addon
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingAddon(false)} 
                  className="w-full"
                >
                  <X className="mr-2" /> Cancel
                </Button>
              </div>
            </div>
          )}

          {!isAddingAddon && (
            <Button 
              variant="outline" 
              onClick={() => setIsAddingAddon(true)}
              className="flex items-center justify-center h-32"
            >
              <Plus className="mr-2" /> Add New Addon
            </Button>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setCurrentStep(3)}>
            <ChevronLeft className="mr-2" /> Back
          </Button>
          <Button
            onClick={() => setCurrentStep(6)}
            disabled={addons.length === 0}
             className="h-10 bg-[#27534c] hover:bg-[#1a3733]"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};