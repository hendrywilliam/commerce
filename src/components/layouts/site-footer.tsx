import { siteConfig } from "@/config/site-config";

export default function SiteFooter() {
  return (
    <div className="border-t h-64">
      <div className="container h-full w-full py-8">
        <div className="flex justify-between h-full">
          <div className="flex flex-col h-full w-1/2 justify-between">
            <p className="font-bold">ecremmoce</p>
            <p className="text-xs">
              Made by <span className="font-bold">hendry</span>
            </p>
          </div>
          <div className="grid grid-cols-2 w-1/2">
            {siteConfig.footerNavigation.map((item, i) => {
              return (
                <div key={i}>
                  <p className="font-semibold">{item.title}</p>
                  <ul className="flex flex-col gap-1 mt-2">
                    {item.items.map((item, i) => {
                      return (
                        <li key={i}>
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
    </div>
  );
}
