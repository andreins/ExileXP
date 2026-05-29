import { useRef, useState } from "react";

type Props = {
	regex: string;
};

// One-line per-act vendor-search regex with a copy button. The text itself is
// user-selectable (click selects the whole regex via input.select()) so it
// can be pasted into PoE2's shop search bar even if clipboard access fails.
export default function ShopRegexBar({ regex }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		// Try the Clipboard API first; fall back to the legacy execCommand
		// path inside an Electron context where navigator.clipboard isn't
		// always reachable from a non-secure-origin renderer.
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(regex);
			} else if (inputRef.current) {
				inputRef.current.select();
				document.execCommand("copy");
			}
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// Even on failure, select the text so the user can ctrl+C.
			inputRef.current?.select();
		}
	};

	const selectAll = () => inputRef.current?.select();

	return (
		<div className="shopRegexBar" data-always-interactive="true">
			<span className="shopRegexBar__label">Shop:</span>
			<input
				ref={inputRef}
				className="shopRegexBar__input"
				type="text"
				readOnly
				value={regex}
				onClick={selectAll}
				onFocus={selectAll}
				spellCheck={false}
				aria-label="Vendor search regex for this act"
			/>
			<button
				className={`shopRegexBar__copy${copied ? " shopRegexBar__copy--ok" : ""}`}
				onClick={(e) => {
					e.currentTarget.blur();
					copy();
				}}
				title="Copy regex to clipboard"
			>
				{copied ? "Copied" : "Copy"}
			</button>
		</div>
	);
}
