import { GithubIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { footerNavigation, siteName } from "@/config/site";
import NewsLetterPanel from "@/components/newsletter-panel";

export default function SiteFooter() {
  return (
    <footer className="border-t text-sm h-fit">
      <div className="container h-full w-full py-8">
        <div className="w-full grid grid-cols-4 h-full">
          <div>
            <h2 className="font-bold">{siteName}</h2>
          </div>
          <div className="grid grid-cols-2 col-span-2 w-full">
            {footerNavigation.map((item, i) => {
              return (
                <div key={i}>
                  <h2 className="font-semibold">{item.title}</h2>
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
          <NewsLetterPanel />
        </div>
        <div className="w-full grid grid-cols-2 mt-2">
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
