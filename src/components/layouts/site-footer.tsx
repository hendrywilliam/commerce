import { footerNavigation, siteName } from "@/config/site";

export default function SiteFooter() {
  return (
    <footer className="border-t text-sm h-64">
      <div className="container h-full w-full py-8">
        <div className="flex justify-between h-full">
          <div className="flex flex-col h-full w-1/2 justify-between">
            <p className="font-bold">{siteName}</p>
            <p className="text-xs">
              Made by <span className="font-bold">hendry</span>
            </p>
          </div>
          <div className="grid grid-cols-2 w-1/2">
            {footerNavigation.map((item, i) => {
              return (
                <div key={i}>
                  <p className="font-semibold">{item.title}</p>
                  <ul className="flex flex-col gap-1 mt-2">
                    {item.items.map((item, i) => {
                      return (
                        <li
                          className="text-gray-400 hover:text-gray-600"
                          key={i}
                        >
                          <a href={item.href} target="_blank">
                            {item.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
