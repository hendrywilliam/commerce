import { GithubIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { footerNavigation, siteName } from "@/config/site";

export default function SiteFooter() {
  return (
    <footer className="h-fit border-t text-sm">
      <div className="container h-full w-full p-4 py-8">
        <div className="grid h-full w-full grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1">
          <div>
            <h2 className="font-bold">{siteName}</h2>
          </div>
          <div className="grid w-full grid-cols-2">
            {footerNavigation.map((item, i) => {
              return (
                <div key={i}>
                  <h2 className="font-semibold">{item.title}</h2>
                  <ul className="mt-2 flex flex-col gap-1">
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
        <div className="mt-4 grid w-full grid-cols-2">
          <div>
            <p>
              Made by <span className="font-bold">hendry</span>
            </p>
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
      </div>
    </footer>
  );
}
