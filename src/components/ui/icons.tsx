import { SVGProps } from "react";

export function IconCart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M219.07 61.44A4 4 0 0 0 216 60H51.34l-5.48-30.15A12 12 0 0 0 34.05 20H16a4 4 0 0 0 0 8h18a4 4 0 0 1 4 3.28l25.5 140.3a20 20 0 0 0 7.5 12.27a24 24 0 1 0 30.87 4.15h60.26a24 24 0 1 0 17.87-8H83.17a12 12 0 0 1-11.8-9.85l-4-22.15H188.1a20 20 0 0 0 19.68-16.42l12.16-66.86a4 4 0 0 0-.87-3.28ZM100 204a16 16 0 1 1-16-16a16 16 0 0 1 16 16Zm96 0a16 16 0 1 1-16-16a16 16 0 0 1 16 16Zm3.91-73.85A12 12 0 0 1 188.1 140H65.88L52.79 68h158.42Z"
      ></path>
    </svg>
  );
}

export function IconNotification(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M164 224a4 4 0 0 1-4 4H96a4 4 0 0 1 0-8h64a4 4 0 0 1 4 4Zm54.38-34a11.84 11.84 0 0 1-10.38 6H48a12 12 0 0 1-10.35-18C43.42 168 52 140.13 52 104a76 76 0 1 1 152 0c0 36.13 8.59 64 14.36 73.95a11.92 11.92 0 0 1 .02 12.05Zm-6.95-8C204 169.17 196 139.31 196 104a68 68 0 1 0-136 0c0 35.32-8 65.17-15.44 78a4 4 0 0 0 0 4a3.91 3.91 0 0 0 3.44 2h160a3.91 3.91 0 0 0 3.44-2a4 4 0 0 0-.01-4Z"
      ></path>
    </svg>
  );
}

export function IconShowPassword(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path
          d="M12 9.005a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 1.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365a8.503 8.503 0 0 0-16.493.004a.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5z"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
}

export function IconLoading(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
        opacity=".5"
      ></path>
      <path
        fill="currentColor"
        d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 12 12"
          repeatCount="indefinite"
          to="360 12 12"
          type="rotate"
        ></animateTransform>
      </path>
    </svg>
  );
}

export function IconBackpack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 28 28"
      {...props}
    >
      <path
        fill="black"
        d="M9 12.25A3.25 3.25 0 0 1 12.25 9h3.5A3.25 3.25 0 0 1 19 12.25A1.75 1.75 0 0 1 17.25 14h-6.5A1.75 1.75 0 0 1 9 12.25Zm3.25-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25a1.75 1.75 0 0 0-1.75-1.75h-3.5ZM14 2a5.001 5.001 0 0 0-4.936 4.198A9.748 9.748 0 0 0 4 14.75v7.5A3.75 3.75 0 0 0 7.75 26h12.5A3.75 3.75 0 0 0 24 22.25v-7.5a9.748 9.748 0 0 0-5.064-8.552A5.001 5.001 0 0 0 14 2Zm-.25 3c-1.003 0-1.97.151-2.88.432a3.5 3.5 0 0 1 6.26 0A9.748 9.748 0 0 0 14.25 5h-.5Zm0 1.5h.5a8.25 8.25 0 0 1 8.25 8.25V16h-17v-1.25a8.25 8.25 0 0 1 8.25-8.25ZM9 17.5v1.75a.75.75 0 0 0 1.5 0V17.5h12v4.75a2.25 2.25 0 0 1-2.25 2.25H7.75a2.25 2.25 0 0 1-2.25-2.25V17.5H9Z"
      ></path>
    </svg>
  );
}

export function IconShoes(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="black"
        d="m227.38 132.91l-60.72-20.24A28 28 0 0 1 150 97.53l-23.31-54.41a12 12 0 0 0-15.07-6.4L35.9 64.25A12 12 0 0 0 28 75.53V192a12 12 0 0 0 12 12h200a12 12 0 0 0 12-12v-24.94a36 36 0 0 0-24.62-34.15ZM38.63 71.77l75.72-27.53a3.84 3.84 0 0 1 1.37-.24a4 4 0 0 1 3.63 2.32L128.17 67l-25.54 9.29A4 4 0 0 0 104 84a4.12 4.12 0 0 0 1.37-.24l25.95-9.44l7.89 18.44l-20.58 7.48A4 4 0 0 0 120 108a4.12 4.12 0 0 0 1.37-.24l21-7.64l.25.6a36.11 36.11 0 0 0 13.52 15.7l-21.5 7.82A4 4 0 0 0 136 132a4.12 4.12 0 0 0 1.37-.24l29.3-10.66l58.18 19.4a28 28 0 0 1 19 23.5H36V75.53a4 4 0 0 1 2.63-3.76ZM240 196H40a4 4 0 0 1-4-4v-20h208v20a4 4 0 0 1-4 4Z"
      ></path>
    </svg>
  );
}

export function IconTshirt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="black"
        d="m245.68 64.73l-51.77-28.24A4 4 0 0 0 192 36h-32a4 4 0 0 0-4 4a28 28 0 0 1-56 0a4 4 0 0 0-4-4H64a4 4 0 0 0-1.9.5L10.32 64.73a11.79 11.79 0 0 0-5 15.89l19.28 36.81a12.37 12.37 0 0 0 11 6.57H60v84a12 12 0 0 0 12 12h112a12 12 0 0 0 12-12v-84h24.33a12.37 12.37 0 0 0 11-6.57l19.28-36.81a11.79 11.79 0 0 0-4.93-15.89ZM35.67 116a4.46 4.46 0 0 1-4-2.28L12.44 76.91a3.79 3.79 0 0 1 1.71-5.15L60 46.74V116ZM188 208a4 4 0 0 1-4 4H72a4 4 0 0 1-4-4V44h24.22a36 36 0 0 0 71.56 0H188Zm55.56-131.09l-19.27 36.81a4.46 4.46 0 0 1-4 2.28H196V46.74l45.85 25a3.79 3.79 0 0 1 1.71 5.17Z"
      ></path>
    </svg>
  );
}

export function IconMagnifyingGlass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72Z"
      ></path>
    </svg>
  );
}

export function IconClothing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="m245.68 64.73l-51.77-28.24A4 4 0 0 0 192 36h-32a4 4 0 0 0-4 4a28 28 0 0 1-56 0a4 4 0 0 0-4-4H64a4 4 0 0 0-1.9.5L10.32 64.73a11.79 11.79 0 0 0-5 15.89l19.28 36.81a12.37 12.37 0 0 0 11 6.57H60v84a12 12 0 0 0 12 12h112a12 12 0 0 0 12-12v-84h24.33a12.37 12.37 0 0 0 11-6.57l19.28-36.81a11.79 11.79 0 0 0-4.93-15.89ZM35.67 116a4.46 4.46 0 0 1-4-2.28L12.44 76.91a3.79 3.79 0 0 1 1.71-5.15L60 46.74V116ZM188 208a4 4 0 0 1-4 4H72a4 4 0 0 1-4-4V44h24.22a36 36 0 0 0 71.56 0H188Zm55.56-131.09l-19.27 36.81a4.46 4.46 0 0 1-4 2.28H196V46.74l45.85 25a3.79 3.79 0 0 1 1.71 5.17Z"
      ></path>
    </svg>
  );
}

export function IconStores(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.5 8.5V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8.5M8 8.5v5M1.5 10H8M.5 4L2 .5h10L13.5 4H.5zm4.25 0v1a2 2 0 0 1-2 2h-.28a2 2 0 0 1-2-2V4m8.78 0v1a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2V4m8.75 0v1a2 2 0 0 1-2 2h-.25a2 2 0 0 1-2-2V4"
      ></path>
    </svg>
  );
}

export function IconCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6 12.25A6.25 6.25 0 0 1 12.25 6h23.5A6.25 6.25 0 0 1 42 12.25v23.5A6.25 6.25 0 0 1 35.75 42h-23.5A6.25 6.25 0 0 1 6 35.75v-23.5Zm6.25-3.75a3.75 3.75 0 0 0-3.75 3.75V14h31v-1.75a3.75 3.75 0 0 0-3.75-3.75h-23.5ZM8.5 35.75a3.75 3.75 0 0 0 3.75 3.75h23.5a3.75 3.75 0 0 0 3.75-3.75V16.5h-31v19.25Z"
      ></path>
    </svg>
  );
}

export function IconPayment(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="M13.5 13a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2ZM2 6.75A2.75 2.75 0 0 1 4.75 4h10.5A2.75 2.75 0 0 1 18 6.75v6.5A2.75 2.75 0 0 1 15.25 16H4.75A2.75 2.75 0 0 1 2 13.25v-6.5ZM4.75 5A1.75 1.75 0 0 0 3 6.75V8h14V6.75A1.75 1.75 0 0 0 15.25 5H4.75ZM17 9H3v4.25c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0 0 17 13.25V9Z"
      ></path>
    </svg>
  );
}

export function IconAnalytics(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="m344 280l88-88m-200 24l64 64M80 320l104-104"
      ></path>
      <circle
        cx="456"
        cy="168"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      ></circle>
      <circle
        cx="320"
        cy="304"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      ></circle>
      <circle
        cx="208"
        cy="192"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      ></circle>
      <circle
        cx="56"
        cy="344"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      ></circle>
    </svg>
  );
}

export function IconTrashCan(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
    >
      <path fill="currentColor" d="M12 12h2v12h-2zm6 0h2v12h-2z"></path>
      <path
        fill="currentColor"
        d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z"
      ></path>
    </svg>
  );
}

export function IconUpload(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M220 152v56a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12v-56a4 4 0 0 1 8 0v56a4 4 0 0 0 4 4h160a4 4 0 0 0 4-4v-56a4 4 0 0 1 8 0ZM90.83 82.83L124 49.66V152a4 4 0 0 0 8 0V49.66l33.17 33.17a4 4 0 1 0 5.66-5.66l-40-40a4 4 0 0 0-5.66 0l-40 40a4 4 0 0 0 5.66 5.66Z"
      ></path>
    </svg>
  );
}

export function IconView(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4c4.182 0 7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20c-4.182 0-7.028-2.5-8.725-4.704Z"></path>
        <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
      </g>
    </svg>
  );
}

export function IconSort(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
      ></path>
    </svg>
  );
}

export function IconFilter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2ZM6 6v3.59l8 8V26h4v-8.41l8-8V6Z"
      ></path>
    </svg>
  );
}

export function IconArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.12 14.71L12 10.83l3.88 3.88a.996.996 0 1 0 1.41-1.41L12.7 8.71a.996.996 0 0 0-1.41 0L6.7 13.3a.996.996 0 0 0 0 1.41c.39.38 1.03.39 1.42 0z"
      ></path>
    </svg>
  );
}

export function IconArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 10l5 5m0 0l5-5"
      ></path>
    </svg>
  );
}

export function IconImagePlaceholder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h12.77q.69 0 1.152.463q.463.462.463 1.152v12.77q0 .69-.462 1.152q-.463.463-1.153.463H5.615ZM6 13.287l3.435-3.435q.242-.242.565-.242q.323 0 .565.242L14 13.287l3.435-3.435q.242-.242.565-.242q.323 0 .565.242l.435.435V5.615q0-.269-.173-.442T18.385 5H5.615q-.269 0-.442.173T5 5.615v6.672l1 1ZM5.615 19h12.77q.269 0 .442-.173t.173-.442v-6.677l-1-1l-3.435 3.434q-.242.243-.565.243q-.323 0-.565-.243L10 10.708l-3.435 3.434q-.242.243-.565.243q-.323 0-.565-.243L5 13.708v4.677q0 .269.173.442t.442.173ZM5 19v-7.292v1V5v14Z"
      ></path>
    </svg>
  );
}

export function IconArrowBackward(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16 21.308L6.692 12L16 2.692l1.063 1.064L8.82 12l8.244 8.244L16 21.308Z"
      ></path>
    </svg>
  );
}

export function IconArrowForward(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m8.006 21.308l-1.064-1.064L15.187 12L6.942 3.756l1.064-1.064L17.313 12l-9.307 9.308Z"
      ></path>
    </svg>
  );
}

export function ShipmentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="13" height="13" x=".5" y=".5" rx="1"></rect>
        <path d="M9 .5v5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-5M8.5 11H11"></path>
      </g>
    </svg>
  );
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor">
        <path strokeLinecap="round" d="M8 10V7a4 4 0 1 1 8 0v3"></path>
        <path
          strokeLinejoin="round"
          d="M5 10h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9Z"
        ></path>
        <path
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M14.5 15.5h.01v.01h-.01z"
        ></path>
      </g>
    </svg>
  );
}

export function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill="currentColor"
        d="m955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 0 1 0-96a48.01 48.01 0 0 1 0 96z"
      ></path>
    </svg>
  );
}
