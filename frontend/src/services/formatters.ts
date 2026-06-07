export const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);

export const parseCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");

    return Number(numeric) / 100;
};