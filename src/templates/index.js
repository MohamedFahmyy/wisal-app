import ClassicWaxTemplate from './ClassicWaxTemplate';
import GardenGateTemplate from './GardenGateTemplate';
import RoseArchTemplate from './RoseArchTemplate';
import MidnightRoyalTemplate from './MidnightRoyalTemplate';
import RingBoxTemplate from './RingBoxTemplate';
import KatbKetabTemplate from './KatbKetabTemplate';
import BirthdayGiftTemplate from './BirthdayGiftTemplate';
import BlancTemplate from './BlancTemplate';
import ProvenceTemplate from './ProvenceTemplate';
import ElegantLetterTemplate from './ElegantLetterTemplate';
import FloralDoorsTemplate from './FloralDoorsTemplate';
import ModernPhotoTemplate from './ModernPhotoTemplate';
import MazenFaridaTemplate from './MazenFaridaTemplate';
import MohamedSalmaTemplate from './MohamedSalmaTemplate';
import VelvetTemplate from './VelvetTemplate';
import LuneTemplate from './LuneTemplate';
import PearlTemplate from './PearlTemplate';
import VeilTemplate from './VeilTemplate';
import SageGardenTemplate from './SageGardenTemplate';
import VelvetVoiceTemplate from './VelvetVoiceTemplate';

export const templateRegistry = {
  classic: ClassicWaxTemplate,
  wax: ClassicWaxTemplate,
  garden: GardenGateTemplate,
  rose: RoseArchTemplate,
  arch: RoseArchTemplate,
  midnight: MidnightRoyalTemplate,
  ring: RingBoxTemplate,
  katbketab: KatbKetabTemplate,
  birthday: BirthdayGiftTemplate,
  party: BirthdayGiftTemplate,
  blanc: BlancTemplate,
  provence: ProvenceTemplate,
  letter: ElegantLetterTemplate,
  doors: FloralDoorsTemplate,
  modern: ModernPhotoTemplate,
  'mazen-farida': MazenFaridaTemplate,
  'mohamed-salma': MohamedSalmaTemplate,
  farha: MazenFaridaTemplate,
  velvet: VelvetTemplate,
  rosearch: RoseArchTemplate,
  'rose-arch': RoseArchTemplate,
  lune: LuneTemplate,
  'under-the-moonlight': LuneTemplate,
  pearl: PearlTemplate,
  veil: VeilTemplate,
  'sage-garden': SageGardenTemplate,
  sage: SageGardenTemplate,
  'velvet-voice': VelvetVoiceTemplate,
  velvetvoice: VelvetVoiceTemplate
};

export function getTemplateComponent(templateKey) {
  return templateRegistry[templateKey] || ClassicWaxTemplate;
}
