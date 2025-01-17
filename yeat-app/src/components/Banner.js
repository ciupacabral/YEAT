import React from 'react'; 
import './Banner.css';

const links = [
    { name: 'Open roles', href: '#' },
    { name: 'Internship program', href: '#' },
    { name: 'Our values', href: '#' },
    { name: 'Meet our leadership', href: '#' },
];

const stats = [
    { name: 'Of Menu Items', value: 'Hundreds' },
    { name: 'Locations', value: '1700+' },
    { name: 'Of Food Categories', value: 'Vast Variety' },
];


export default function Example() {
    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
            <div className="absolute inset-0">
                <img
                    alt="Restaurant Background"
                    src="restaurant1.jpg" 
                    className="h-full w-full object-cover md:object-cover custom-object-position" // Use custom class for mobile positioning
                />
                <div className="absolute inset-0 bg-black opacity-65"></div> {/* Dark overlay */}
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                        <span className="animated-gradient">
                            Yeat
                        </span>
                        : Your Cravings, Just Around the Corner!
                    </h2>
                    <style>
                        {`
    .animated-gradient {
    font-weight: bold;
    -webkit-text-stroke: 0.5px #FFF8E1;
    background: linear-gradient(90deg,#FF7043, #FAFAFA, #550c55);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    transition: background-position 0.5s ease;
  }

  .animated-gradient:hover {
    background-position: 100% 0;
  }
`}
                    </style>
                    {/*}
                    <p className="mt-8 text-gray-300 text-lg font-medium sm:text-xl">
                       Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                        fugiat veniam occaecat fugiat.
                    </p>
                    */}
                </div>
                <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                    {/*<div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                        {links.map((link) => (
                            <a key={link.name} href={link.href} className="hover:underline">
                                {link.name} <span aria-hidden="true">&rarr;</span>
                            </a>
                        ))}
                    </div>*/}
                    <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.name} className="flex flex-col-reverse gap-1">
                                <dt className="text-2xl text-gray-200">{stat.name}</dt>
                                <dd className="text-5xl font-semibold tracking-tight text-white">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}


