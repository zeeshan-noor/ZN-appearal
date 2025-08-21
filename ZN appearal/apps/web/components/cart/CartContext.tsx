"use client";
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export type CartItem = {
	id: string;
	slug: string;
	name: string;
	price: number; // in cents
	imageUrl?: string | null;
	qty: number;
};

type CartState = { items: CartItem[] };
type CartAction =
	| { type: 'ADD'; item: Omit<CartItem, 'qty'>; qty?: number }
	| { type: 'REMOVE'; id: string }
	| { type: 'SET_QTY'; id: string; qty: number }
	| { type: 'CLEAR' };

const STORAGE_KEY = 'cart_v1';

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case 'ADD': {
			const existing = state.items.find((i) => i.id === action.item.id);
			if (existing) {
				return {
					items: state.items.map((i) => (i.id === action.item.id ? { ...i, qty: i.qty + (action.qty || 1) } : i)),
				};
			}
			return { items: [...state.items, { ...action.item, qty: action.qty || 1 }] };
		}
		case 'REMOVE':
			return { items: state.items.filter((i) => i.id !== action.id) };
		case 'SET_QTY':
			return { items: state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)) };
		case 'CLEAR':
			return { items: [] };
		default:
			return state;
	}
}

type CartContextValue = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
	removeItem: (id: string) => void;
	setQty: (id: string, qty: number) => void;
	clear: () => void;
	count: number;
	subtotal: number; // in cents
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, { items: [] });

	// Load from localStorage once
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed: CartState = JSON.parse(raw);
				if (parsed?.items) {
					parsed.items.forEach((it) => dispatch({ type: 'ADD', item: { id: it.id, slug: it.slug, name: it.name, price: it.price, imageUrl: it.imageUrl }, qty: it.qty }));
					dispatch({ type: 'CLEAR' }); // reset then re-add to avoid dup; we'll rehydrate below properly
					parsed.items.forEach((it) => dispatch({ type: 'ADD', item: { id: it.id, slug: it.slug, name: it.name, price: it.price, imageUrl: it.imageUrl }, qty: it.qty }));
				}
			}
		} catch {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist to localStorage
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {}
	}, [state]);

	const value = useMemo<CartContextValue>(() => ({
		items: state.items,
		addItem: (item, qty) => dispatch({ type: 'ADD', item, qty }),
		removeItem: (id) => dispatch({ type: 'REMOVE', id }),
		setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
		clear: () => dispatch({ type: 'CLEAR' }),
		count: state.items.reduce((n, i) => n + i.qty, 0),
		subtotal: state.items.reduce((sum, i) => sum + i.qty * i.price, 0),
	}), [state]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
}


