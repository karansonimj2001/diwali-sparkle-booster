import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Will these earrings tarnish?",
      answer: "No! Our earrings feature an advanced tarnish-resistant coating that keeps them looking new for years. Even with regular wear, they maintain their beautiful shine. Simply store them in the provided satin pouch when not in use.",
    },
    {
      question: "Can I return them if I'm gifting?",
      answer: "Absolutely! We offer a 30-day hassle-free return policy. If the recipient doesn't love them, they can easily return for a full refund. We'll even help coordinate the return discreetly if it's a gift.",
    },
    {
      question: "How will the invoice be handled if I select hide price?",
      answer: "When you check 'Hide price on invoice', we'll send the invoice to your email only. The package will include just the gift box with no pricing information, keeping your gift amount private.",
    },
    {
      question: "What's the last date to order for Diwali delivery?",
      answer: "Order by 25th October to guarantee delivery before Diwali. We ship within 24 hours and delivery takes 3-5 days across India. Express shipping available for last-minute orders.",
    },
    {
      question: "Are these safe for sensitive ears?",
      answer: "Yes! The earring posts are hypoallergenic and nickel-free, making them perfect for sensitive ears. Many customers with metal allergies wear these comfortably every day.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods: UPI, Credit/Debit Cards, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD). All online payments are 100% secure.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
