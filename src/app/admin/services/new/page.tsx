import { ServiceForm } from "@/components/admin/ServiceForm";
export default function NewServicePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-base mb-6">New Service</h1>
      <ServiceForm />
    </div>
  );
}