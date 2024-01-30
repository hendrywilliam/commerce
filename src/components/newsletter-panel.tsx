import NewsletterSubscribeForm from "@/components/newsletter-subscribe-form";

export default async function NewsLetterPanel() {
  return (
    <div>
      <h2 className="font-bold">Subscribe to Newsletter</h2>
      <NewsletterSubscribeForm />
    </div>
  );
}
