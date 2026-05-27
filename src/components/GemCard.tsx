// TODO: source PoE2 gem icons; see Appendix B
import type { SkillGemEntry } from "../types/guide";
import { attrFor } from "../lib/gemAttr";

type Props = {
	gem: SkillGemEntry;
};

export default function GemCard({ gem }: Props) {
	const displayName = gem.displayName ?? gem.name;
	const attr = gem.attr ?? attrFor(gem.name);
	const iconLetter = displayName.charAt(0).toUpperCase();

	return (
		<div className="gemCard">
			<div className="gemCard__header">
				<span className="gemCard__slotBadge">{gem.slot}</span>
				<span
					className={`gemCard__icon gemCard__icon--${attr}`}
					data-attr={attr}
					aria-hidden="true"
				>
					{iconLetter}
				</span>
				<div className="gemCard__info">
					<span className="gemCard__name">{displayName}</span>
					<span className="gemCard__level">Lv {gem.level}</span>
				</div>
			</div>
			{gem.supports.length > 0 && (
				<div className="gemCard__supports">
					{gem.supports.map((sup, i) => {
						const supAttr = sup.attr ?? attrFor(sup.name);
						return (
							<span key={i} className="supportChip">
								<span
									className={`supportChip__dot supportChip__dot--${supAttr}`}
									aria-hidden="true"
								/>
								<span className="supportChip__name">{sup.name}</span>
							</span>
						);
					})}
				</div>
			)}
		</div>
	);
}
