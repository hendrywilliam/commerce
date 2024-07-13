"use client";

import {
    TrashcanIcon,
    IconArrowUp,
    IconArrowDown,
    IconLoading,
} from "@/components/ui/icons";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { CartLineDetailedItems } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { updateCartItem } from "@/actions/carts/update-cart-item";
import { deleteCartItemAction } from "@/actions/carts/delete-cart-item";

interface CartItemActionProps {
    cartItem: CartLineDetailedItems;
}

export default function CartItemAction({ cartItem }: CartItemActionProps) {
    const [isNewValue, setIsNewValue] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [productQuantity, setProductQuantity] = useState(cartItem.qty);
    const [isDeletingCurrentItem, setIsDeletingCurrentItem] = useState(false);

    const { push } = useRouter();

    function deleteCurrentItemInCart() {
        startTransition(async () => {
            setIsDeletingCurrentItem(
                (isDeletingCurrentItem) => !isDeletingCurrentItem
            );
            try {
                await deleteCartItemAction(cartItem.id);
                toast.success("Item successfully removed from your cart.");
            } catch (err) {
                catchError(err);
            } finally {
                setIsDeletingCurrentItem(
                    (isDeletingCurrentItem) => !isDeletingCurrentItem
                );
            }
        });
    }

    useEffect(() => {
        const bounceUpdate = setTimeout(() => {
            startTransition(async () => {
                // It wont run the update at initial render.
                if (isNewValue) {
                    await updateCartItem(cartItem.id, productQuantity);
                    toast.success("Your cart has been updated.");
                }
            });
        }, 500);

        return () => clearTimeout(bounceUpdate);
        // eslint-disable-next-line
    }, [productQuantity]);

    return (
        <div className="flex h-full w-full justify-between gap-4 py-2">
            <div>
                <Button
                    onClick={() => void push(`/store/${cartItem.storeSlug}`)}
                    className="h-6 w-6"
                    size="icon"
                    variant="outline"
                >
                    Store
                </Button>
            </div>
            <div className="inline-flex gap-4">
                <div className="flex gap-1">
                    <Button
                        disabled={isPending}
                        aria-disabled={isPending ? "true" : "false"}
                        className="h-6 w-6"
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            setProductQuantity(
                                (productQuantity) => productQuantity + 1
                            );
                            setIsNewValue(true);
                        }}
                    >
                        <IconArrowUp />
                    </Button>
                    <Input
                        value={productQuantity}
                        min={1}
                        type="number"
                        disabled={isPending}
                        aria-disabled={isPending ? "true" : "false"}
                        className="h-6 w-16 p-2"
                        onChange={(e) => {
                            setProductQuantity((productQuantity) =>
                                productQuantity > 1 ? e.target.valueAsNumber : 1
                            );
                            setIsNewValue(true);
                        }}
                    />
                    <Button
                        disabled={isPending}
                        aria-disabled={isPending ? "true" : "false"}
                        className="h-6 w-6"
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            setProductQuantity(
                                (productQuantity) => productQuantity - 1
                            );
                            setIsNewValue(true);
                        }}
                    >
                        <IconArrowDown />
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={() => void deleteCurrentItemInCart()}
                        className="h-6 w-6"
                        size="icon"
                        variant="outline"
                        disabled={isDeletingCurrentItem}
                        aria-disabled={isDeletingCurrentItem ? "true" : "false"}
                    >
                        {isDeletingCurrentItem ? (
                            <IconLoading />
                        ) : (
                            <TrashcanIcon />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
