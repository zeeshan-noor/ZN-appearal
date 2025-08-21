"use client";
import { useRouter, usePathname } from 'next/navigation';
import { clearToken, getToken, isTokenValid } from '../../lib/auth';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	// Keep this layout minimal so login page looks clean; protected pages use (protected)/layout.tsx
	return <>{children}</>;
}


