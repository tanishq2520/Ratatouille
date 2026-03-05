"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChefHat,
  Loader2,
  Package,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import {
  getPantryItems,
  deletePantryItem,
  updatePantryItem,
} from "@/actions/pantry.actions";
import { toast } from "sonner";
import AddToPantryModal from "@/components/AddToPantryModal";
import PricingModal from "@/components/PricingModal";

const Pantrypage = () => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", quantity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch pantry items
  const {
    loading: loadingItems,
    data: itemsData,
    fn: fetchItems,
  } = useFetch(getPantryItems);

  // Delete item
  const {
    loading: deleting,
    data: deleteData,
    fn: deleteItem,
  } = useFetch(deletePantryItem);

  // Update item
  const {
    loading: updating,
    data: updateData,
    fn: updateItem,
  } = useFetch(updatePantryItem);

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Update items when data arrives
  useEffect(() => {
    if (itemsData?.success) {
      setItems(itemsData.items);
    }
  }, [itemsData]);

  // Refresh after delete
  useEffect(() => {
    if (deleteData?.success && !deleting) {
      toast.success("Item removed from pantry");
      fetchItems();
    }
  }, [deleteData]);

  // Refresh after update
  useEffect(() => {
    if (updateData?.success) {
      toast.success("Item updated successfully");
      setEditingId(null);
      fetchItems();
    }
  }, [updateData]);

  // Handle delete
  const handleDelete = async (itemId) => {
    const formData = new FormData();
    formData.append("itemId", itemId);
    await deleteItem(formData);
  };

  // Start editing
  const startEdit = (item) => {
    setEditingId(item.documentId);
    setEditValues({
      name: item.name,
      quantity: item.quantity,
    });
  };

  // Save edit
  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("itemId", editingId);
    formData.append("name", editValues.name);
    formData.append("quantity", editValues.quantity);
    await updateItem(formData);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", quantity: "" });
  };

  const handleModalSuccess = () => {
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pt-24 pb-16 px-4 relative font-sans">
      {/* Global Pattern: Subtle Foodie Theme Background - Toned down for elegance */}
      <div className="fixed inset-0 pointer-events-none z-[-2]">
         <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-amber-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
         <div className="absolute top-1/2 left-0 w-[30vw] h-[30vw] bg-orange-700/5 rounded-full blur-[120px] -translate-x-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-emerald-600/5 rounded-full blur-[120px] translate-y-1/3" />
         <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-stone-100">
                <Package className="w-8 h-8 text-stone-700" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-tight leading-tight">
                  My Kitchen
                </h1>
                <p className="text-lg text-stone-500 font-light mt-1.5 font-sans">
                  Manage your inventory and discover culinary possibilities.
                </p>
              </div>
            </div>

            {/* Add to Pantry Button - Desktop */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex bg-stone-800 hover:bg-stone-700 text-white gap-2 rounded-lg shadow-sm px-7 py-6 text-base font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Ingredient
            </Button>
          </div>

          {/* Add to Pantry Button - Mobile (Full Width) */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden w-full bg-stone-800 hover:bg-stone-700 text-white gap-2 mb-6 rounded-lg shadow-sm py-6 text-base font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Ingredient
          </Button>

          {/* Usage Stats */}
          {itemsData?.scansLimit !== undefined && (
            <div className="bg-white/70 backdrop-blur-md py-2.5 px-5 rounded-xl border border-stone-200/60 inline-flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <div className="text-sm font-medium text-stone-600 font-sans tracking-wide">
                {itemsData.scansLimit === "unlimited" ? (
                  <>
                    <span className="font-semibold text-emerald-700 mr-2">∞</span>
                    Unlimited AI Generation
                  </>
                ) : (
                  <PricingModal>
                    <span className="text-emerald-700 cursor-pointer hover:text-emerald-800 transition-colors">
                      Upgrade to unlock unlimited meal ideas
                    </span>
                  </PricingModal>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Banner - Elegant Gradient */}
        {items.length > 0 && (
          <Link href="/pantry/recipes" className="block mb-12">
            <div className="relative overflow-hidden rounded-xl cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-600" />
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

              <div className="relative p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                  <ChefHat className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-1 tracking-tight">
                    Generate Recipe Suggestions
                  </h3>
                  <p className="text-emerald-50 text-sm md:text-base font-light font-sans opacity-90">
                    Utilize algorithmic pairing for your {items.length} logged ingredients.
                  </p>
                </div>
                
                <div className="hidden md:block">
                  <span className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-4 py-2 text-xs font-medium uppercase tracking-widest rounded-lg transition-colors inline-block">
                    Proceed
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Loading State */}
        {loadingItems && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-stone-400 animate-spin mb-4" />
            <p className="font-sans text-stone-500 font-medium">Retrieving inventory...</p>
          </div>
        )}

        {/* Inventory Grid - Glassmorphic but structured */}
        {!loadingItems && items.length > 0 && (
          <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl border border-stone-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200/50">
              <h2 className="text-2xl font-serif text-stone-800 tracking-tight">
                Current Inventory
              </h2>
              <span className="text-sm font-medium text-stone-500 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.documentId}
                  className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 hover:border-emerald-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 group"
                >
                  {editingId === item.documentId ? (
                    // Edit Mode - Form
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5 block">Ingredient</label>
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({ ...editValues, name: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-800 bg-white transition-all text-sm"
                          placeholder="e.g., Chicken Breast"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1.5 block">Quantity</label>
                        <input
                          type="text"
                          value={editValues.quantity}
                          onChange={(e) =>
                            setEditValues({ ...editValues, quantity: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-800 bg-white transition-all text-sm"
                          placeholder="e.g., 2 lbs or 3 pieces"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={saveEdit}
                          disabled={updating}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm h-10"
                        >
                          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1.5" /> Save</>}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={updating}
                          className="flex-1 border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg h-10"
                        >
                          <X className="w-4 h-4 mr-1.5" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode - Data Display
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-3">
                          <h3 className="font-serif text-xl text-stone-800 mb-1.5 capitalize group-hover:text-emerald-700 transition-colors">
                            {item.name}
                          </h3>
                          <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-600 text-sm font-medium rounded-md border border-stone-200/50">
                            {item.quantity}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-white border border-stone-200 text-stone-500 p-2 rounded-lg hover:border-stone-300 hover:text-stone-700 transition-colors shadow-sm"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.documentId)}
                            disabled={deleting}
                            className="bg-white border border-stone-200 text-stone-500 p-2 rounded-lg hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Footer Data */}
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <span className="text-[11px] font-medium text-stone-400 tracking-wide uppercase">
                          Added: {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Elegant */}
        {!loadingItems && items.length === 0 && (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 md:p-16 text-center border border-stone-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Package className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-2xl font-serif text-stone-800 mb-3 tracking-tight">
              Inventory is Empty
            </h3>
            <p className="text-stone-500 text-base max-w-md mx-auto mb-8 font-light">
              Begin by documenting your available ingredients to unlock algorithmic recipe pairings.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-stone-800 hover:bg-stone-700 text-white rounded-lg px-8 py-6 text-base font-medium transition-colors shadow-sm inline-flex gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Ingredient
            </Button>
          </div>
        )}
      </div>

      <AddToPantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Pantrypage;
