export default function Footer() {
  const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || "Marc";

  return (
    <footer className="mt-12 pt-8 pb-12 border-t border-gray-100 text-center">
      <p className="text-sm text-gray-400 italic mb-3">
        &ldquo;Built in response to an expired link. Hopefully the interview won&apos;t expire too.&rdquo;
      </p>
      <p className="text-xs text-gray-300">
        Made with care by {ownerName}
      </p>
    </footer>
  );
}
