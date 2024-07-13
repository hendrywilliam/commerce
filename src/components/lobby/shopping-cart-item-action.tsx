"use client";

import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition, useRef } from "react";
import { TrashcanIcon, IconLoading } from "@/components/ui/icons";
import { updateCartItem } from "@/actions/carts/update-cart-item";
import { deleteCartItemAction } from "@/actions/carts/delete-cart-item";

interface Props {
    id: number;
    qty: number;
}

export default function ShoppingCartItemAction({ id, qty }: Props) {
    const [itemQuantity, setItemQuantity] = useState(qty);
    const [isPending, startTransition] = useTransition();
    const [isDeletingItem, setIsDeletingItem] = useState(false);
    const [isNewValue, setIsNewValue] = useState(false);

    const cacheValueRef = useRef<number>(qty);

    async function handleDeleteItemFromCart() {
        setIsDeletingItem((isDeletingItem) => !isDeletingItem);
        startTransition(async () => {
            toast.promise(deleteCartItemAction(id), {
                loading: "Removing your item from the cart...",
                success: (data) => `${data} has been removed from your cart.`,
                error: (error) => catchError(error),
                finally: () =>
                    setIsDeletingItem((isDeletingItem) => !isDeletingItem),
            });
        });
    }

    useEffect(() => {
        if (isNewValue) {
            const bounceUpdate = setTimeout(async () => {
                startTransition(async () => {
                    try {
                        toast.loading("Updating your item...");
                        const result = await updateCartItem(id, itemQuantity);
                        if (result.error || !result.data) {
                            throw new Error(result.error);
                        }
                        toast.success(`${result.data.name} has been updated.`);
                    } catch (error) {
                        catchError(error);
                    }
                });
            }, 500);
            return () => clearTimeout(bounceUpdate);
        }
        // eslint-disable-next-line
    }, [itemQuantity, isNewValue]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex w-full justify-end">
                <Button
                    onClick={handleDeleteItemFromCart}
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    disabled={isPending}
                    aria-disabled={isPending ? "true" : "false"}
                >
                    {isDeletingItem ? <IconLoading /> : <TrashcanIcon />}
                </Button>
            </div>
            <div className="inline-flex gap-1">
                <Button
                    onClick={() => {
                        setItemQuantity((itemQuantity) => itemQuantity + 1);
                        setIsNewValue(true);
                    }}
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    disabled={isPending}
                    aria-disabled={isPending ? "true" : "false"}
                >
                    &#43;
                </Button>
                <Input
                    value={itemQuantity}
                    onChange={(e) =>
                        void setItemQuantity(e.target.valueAsNumber)
                    }
                    className="h-6 w-16 p-2"
                    type="number"
                    disabled={isPending}
                    aria-disabled={isPending ? "true" : "false"}
                />
                <Button
                    onClick={() => {
                        setItemQuantity((itemQuantity) => itemQuantity - 1);
                        setIsNewValue(true);
                    }}
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    disabled={isPending}
                    aria-disabled={isPending ? "true" : "false"}
                >
                    &#45;
                </Button>
            </div>
        </div>
    );
}
