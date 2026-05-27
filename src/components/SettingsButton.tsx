type Props = {
	open: boolean;
	onClick: () => void;
};

export default function SettingsButton({ open, onClick }: Props) {
	return (
		<button
			className={`settingsBtn${open ? " settingsBtn--active" : ""}`}
			onClick={onClick}
			title={open ? "Close settings" : "Open settings"}
		>
			⚙
		</button>
	);
}
