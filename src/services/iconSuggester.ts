import { LucideIcon, Users, Code, Mail, FileText, Target, Dumbbell, UtensilsCrossed, Moon, Pill, ShoppingCart, Sparkles, Phone, BookOpen, GraduationCap, PenLine, Circle } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
    // Работа
    'встреч|созвон|митинг|call|meeting': Users,
    'код|код|program|разработ|dev|fix|баг': Code,
    'письм|email|почт|mail': Mail,
    'отчёт|report|доклад': FileText,
    'план|plan|стратег': Target,
    // Здоровье
    'трен|спорт|бег|gym|workout|йога': Dumbbell,
    'еда|обед|ужин|завтрак|food|lunch': UtensilsCrossed,
    'сон|спать|отдых|rest|sleep': Moon,
    'таблетк|лекарств|медицин': Pill,
    // Быт
    'купить|магазин|shop|покупк': ShoppingCart,
    'убор|чист|уборк|clean': Sparkles,
    'звонок|позвонить|phone|call': Phone,
    // Учёба
    'читать|книг|read|book': BookOpen,
    'учить|учёба|study|курс': GraduationCap,
    'писать|текст|write|статья': PenLine,
};

// Fallback по умолчанию
const DEFAULT_ICON = Circle;

export function suggestIcon(title: string): LucideIcon {
    const normalizedTitle = title.toLowerCase().trim();

    for (const [pattern, Icon] of Object.entries(ICON_MAP)) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(normalizedTitle)) {
            return Icon;
        }
    }

    return DEFAULT_ICON;
}