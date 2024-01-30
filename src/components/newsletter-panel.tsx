import NewsletterSubscribeForm from "@/components/newsletter-subscribe-form";

export default async function NewsLetterPanel() {
  return (
    <div>
      <h2 className="font-bold">Subscribe to Newsletter</h2>
      <p className="text-sm text-gray-500 mb-2">
        Subscribe to our newsletter and be the first receive exciting
        promotional offers and updates!
      </p>
      <NewsletterSubscribeForm />
    </div>
  );
}
