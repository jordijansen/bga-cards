interface CardAnimation<T> {
    /**
     * The stock to take the card. It will automatically remove the card from the other stock.
     */
    fromStock?: CardStock<T>;
    /**
     * The element to move the card from.
     */
    fromElement?: HTMLElement;
    /**
     * The side before animation.
     */
    originalSide?: 'front' | 'back';
    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
    /**
     * An animation function, based on the `AnimationSettings` settings, that return a Promise at the end of animation (the promise returns true if animation ended, false otherwise)
     */
    animation?: (settings: AnimationSettings) => Promise<boolean>;
}
interface AnimationSettings {
    /**
     * The element to animate. The element is added to the destination stock before the animation starts.
     */
    element: HTMLElement;
    /**
     * The HTMLElement to animate from.
     */
    fromElement: HTMLElement;
    /**
     * The side before animation.
     */
    originalSide?: 'front' | 'back';
    /**
     * If the card is rotated at the start of animation.
     */
    rotationDelta?: number;
    /**
     * An animation function, based on the `AnimationSettings` settings, that return a Promise at the end of animation (the promise returns true if animation ended, false otherwise)
     */
    animation?: (settings: AnimationSettings) => Promise<boolean>;
}
/**
 * Linear slide of the card from origin to destination.
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
declare function stockSlideAnimation(settings: AnimationSettings): Promise<boolean>;
interface AddCardSettings {
    /**
     * If the card will be on its visible side on the stock
     */
    visible?: boolean;
    forceToElement?: HTMLElement;
}
declare type CardSelectionMode = 'none' | 'single' | 'multiple';
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
declare class CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected cards: T[];
    protected selectedCards: T[];
    protected selectionMode: CardSelectionMode;
    /**
     * Called when selection change. Returns the selection.
     *
     * selection: the selected cards of the stock
     * lastChange: the last change on selection card (can be selected or unselected)
     */
    onSelectionChange?: (selection: T[], lastChange: T | null) => void;
    /**
     * Called when selection change. Returns the clicked card.
     *
     * card: the clicked card (can be selected or unselected)
     */
    onCardClick?: (card: T) => void;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager: CardManager<T>, element: HTMLElement);
    /**
     * @returns the cards on the stock
     */
    getCards(): T[];
    /**
     * @returns if the stock is empty
     */
    isEmpty(): boolean;
    /**
     * @returns the selected cards
     */
    getSelection(): T[];
    /**
     * @param card a card
     * @returns if the card is present in the stock
     */
    contains(card: T): boolean;
    protected cardInStock(card: T): boolean;
    protected cardElementInStock(element: HTMLElement): boolean;
    /**
     * @param card a card in the stock
     * @returns the HTML element generated for the card
     */
    getCardElement(card: T): HTMLElement;
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    protected moveFromOtherStock(card: T, cardElement: HTMLElement, animation: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    protected moveFromElement(card: T, cardElement: HTMLElement, animation: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    /**
     * Add an array of cards to the stock.
     *
     * @param cards the cards to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @param shift if number, the number of milliseconds between each card. if true, chain animations
     */
    addCards(cards: T[], animation?: CardAnimation<T>, settings?: AddCardSettings, shift?: number | boolean): void;
    /**
     * Remove a card from the stock.
     *
     * @param card the card to remove
     */
    removeCard(card: T): void;
    cardRemoved(card: T): void;
    /**
     * Remove all cards from the stock.
     */
    removeAll(): void;
    protected setSelectableCard(card: T, selectable: boolean): void;
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected cards.
     *
     * @param selectionMode the selection mode
     */
    setSelectionMode(selectionMode: CardSelectionMode): void;
    /**
     * Set selected state to a card.
     *
     * @param card the card to select
     */
    selectCard(card: T, silent?: boolean): void;
    /**
     * Set unselected state to a card.
     *
     * @param card the card to unselect
     */
    unselectCard(card: T, silent?: boolean): void;
    /**
     * Select all cards
     */
    selectAll(silent?: boolean): void;
    /**
     * Unelect all cards
     */
    unselectAll(silent?: boolean): void;
    protected bindClick(): void;
    protected cardClick(card: T): void;
    protected animationFromElement(settings: AnimationSettings): Promise<boolean>;
}
interface LineStockSettings {
    /**
     * Indicate if the line should wrap when needed (default wrap)
     */
    wrap?: 'wrap' | 'nowrap';
    /**
     * Indicate the line direction (default row)
     */
    direction?: 'row' | 'column';
    /**
     * indicate if the line should be centered (default yes)
     */
    center?: boolean;
    /**
    * CSS to set the gap between cards. '8px' if unset.
    */
    gap?: string;
}
/**
 * A basic stock for a list of cards, based on flex.
 */
declare class LineStock<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    constructor(manager: CardManager<T>, element: HTMLElement, settings?: LineStockSettings);
}
interface SlotStockSettings<T> extends LineStockSettings {
    /**
     * The ids for the slots (can be number or string)
     */
    slotsIds: SlotId[];
    /**
     * The classes to apply to each slot
     */
    slotClasses?: string[];
    /**
     * How to place the card on a slot automatically
     */
    mapCardToSlot?: (card: T) => SlotId;
}
declare type SlotId = number | string;
interface AddCardToSlotSettings extends AddCardSettings {
    /**
     * The slot to place the card on.
     */
    slot?: SlotId;
}
/**
 * A stock with fixed slots (some can be empty)
 */
declare class SlotStock<T> extends LineStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    protected slotsIds: SlotId[];
    protected slots: HTMLDivElement[];
    protected slotClasses: string[];
    protected mapCardToSlot?: (card: T) => SlotId;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    constructor(manager: CardManager<T>, element: HTMLElement, settings: SlotStockSettings<T>);
    protected createSlot(slotId: SlotId): void;
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardToSlotSettings): Promise<boolean>;
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    setSlotsIds(slotsIds: SlotId[]): void;
    protected cardElementInStock(element: HTMLElement): boolean;
}
interface DeckSettings {
    /**
     * Indicate the number of cards in the deck (default 0)
     */
    cardNumber?: number;
    /**
     * indicate if the line should be centered (default yes)
     */
    autoUpdateCardNumber?: boolean;
}
/**
 * Abstract stock to represent a deck. (pile of cards, with a fake 3d effect of thickness).
 */
declare class Deck<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    private cardNumber;
    private autoUpdateCardNumber;
    private thicknessArray;
    constructor(manager: CardManager<T>, element: HTMLElement, settings: DeckSettings);
    setCardNumber(cardNumber: number): void;
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    cardRemoved(card: T): void;
}
declare class HiddenDeck<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    constructor(manager: CardManager<T>, element: HTMLElement, empty?: boolean);
    setEmpty(empty: boolean): void;
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
}
declare class VisibleDeck<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    constructor(manager: CardManager<T>, element: HTMLElement);
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
}
declare class AllVisibleDeck<T> extends CardStock<T> {
    protected manager: CardManager<T>;
    protected element: HTMLElement;
    constructor(manager: CardManager<T>, element: HTMLElement, width: string, height: string, shift: string);
    addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean>;
    /**
     * Set opened state. If true, all cards will be entirely visible.
     *
     * @param opened indicate if deck must be always opened. If false, will open only on hover/touch
     */
    setOpened(opened: boolean): void;
    cardRemoved(card: T): void;
}
interface CardManagerSettings<T> {
    /**
     * @param card the card informations
     * @return the id for a card
     */
    getId?: (card: T) => string;
    /**
     * @param card the card informations
     * @param element the card main Div element. You can add a class (to set width/height), change dataset, ... based on the card informations. There should be no visual informations on it, as it will be set on front/back Divs.
     * @return the id for a card
     */
    setupDiv?: (card: T, element: HTMLDivElement) => void;
    /**
     * @param card the card informations
     * @param element the card main Div element. You can add a class (to set width/height), change dataset, ... based on the card informations. There should be no visual informations on it, as it will be set on front/back Divs.
     * @return the id for a card
     */
    setupFrontDiv?: (card: T, element: HTMLDivElement) => void;
    /**
     * @param card the card informations
     * @param element  the card back Div element. You can add a class, change dataset, set background for the back side
     * @return the id for a card
     */
    setupBackDiv?: (card: T, element: HTMLDivElement) => void;
}
declare class CardManager<T> {
    game: Game;
    private settings;
    private stocks;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `CardManagerSettings` object
     */
    constructor(game: Game, settings: CardManagerSettings<T>);
    addStock(stock: CardStock<T>): void;
    /**
     * @param card the card informations
     * @return the id for a card
     */
    getId(card: T): string;
    createCardElement(card: T, visible?: boolean): HTMLDivElement;
    /**
     * @param card the card informations
     * @return the HTML element of an existing card
     */
    getCardElement(card: T): HTMLElement;
    removeCard(card: T): void;
    /**
     * @param card the card informations
     * @return the stock containing the card
     */
    getCardStock(card: T): CardStock<T>;
}
declare const define: any;
