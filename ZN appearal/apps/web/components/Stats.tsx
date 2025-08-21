"use client";
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

type Stat = {
	label: string;
	value: number;
	suffix?: string;
};

export default function Stats() {
	const ref = useRef<HTMLDivElement | null>(null);
	const inView = useInView(ref, { once: true, margin: '-50px' });
	const [start, setStart] = useState(false);

	useEffect(() => {
		if (inView) setStart(true);
	}, [inView]);

	const stats: Stat[] = [
		{ label: 'Years Experience', value: 32, suffix: '+' },
		{ label: 'Products', value: 100, suffix: '+' },
		{ label: 'Happy Clients', value: 250, suffix: '+' },
		{ label: 'Locations', value: 3 },
	];

	return (
		<section ref={ref} className="bg-white">
			<div className="container-default py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
				{stats.map((s) => (
					<div key={s.label} className="text-center">
						<div className="text-3xl font-extrabold text-brand">
							{start ? (
								<CountUp end={s.value} duration={1.2} suffix={s.suffix} />
							) : (
								<>{0}{s.suffix}</>
							)}
						</div>
						<div className="mt-1 text-sm text-gray-600">{s.label}</div>
					</div>
				))}
			</div>
		</section>
	);
}


