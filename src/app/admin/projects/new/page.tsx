import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="p-6 lg:p-10 w-full">
      <h1 className="text-3xl font-bold text-base mb-8">New Project</h1>
      <ProjectForm />
    </div>
  );
}