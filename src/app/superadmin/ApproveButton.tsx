"use client";

export default function ApproveButton({ id }: { id: string }) {
  async function handleApprove() {
    const formData = new FormData();
    formData.append("id", id);

    const res = await fetch("/api/companies/approve", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      window.location.reload(); // refresh list
    } else {
      alert("Approval failed");
    }
  }

  return (
    <button
      onClick={handleApprove}
      className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
    >
      Approve Instance
    </button>
  );
}
