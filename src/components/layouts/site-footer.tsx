import { GithubIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { footerNavigation, siteName } from "@/config/site";

export default function SiteFooter() {
  return (
    <footer className="border-t text-sm h-full">
      <div className="container h-full w-full py-8">
        <div className="flex flex-col gap-4 lg:flex-row justify-between h-full">
          <div className="flex flex-col w-full h-full order-2 lg:w-1/2 lg:order-1 justify-between">
            <p className="font-bold">{siteName}</p>
            <p className="text-sm">
              Made by <span className="font-bold">hendry</span>
            </p>
          </div>
          <div className="grid grid-cols-2 w-full order-1 lg:w-1/2 lg:order-2">
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
        <div className="flex w-full justify-end">
          <a
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
            href="https://github.com/hendrywilliam/commerce"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
