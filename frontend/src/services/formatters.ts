export const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);

export const parseCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");

    return Number(numeric) / 100;
};

export const formatDatetime = (date: string): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error('Data inválida');
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};