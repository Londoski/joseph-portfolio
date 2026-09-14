import { TestimonialForm } from "@/components/admin/TestimonialForm";
export default function NewTestimonialPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-base mb-6">New Testimonial</h1>
      <TestimonialForm />
    </div>
  );
}