class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.currencies = [];
    }

    async getCurrencies(){
        try {
            const response = await fetch(`${this.apiUrl}/currencies`);
            const data = await response.json();
            Object.entries(data).forEach(([code, name]) => {
                let tipoMoneda = new Currency(code, name);
                this.currencies.push(tipoMoneda);
            });
            console.log (this.currencies)
        } catch (error){
        console.log("error", error);
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency){
        if (fromCurrency == toCurrency){
            return parseFloat (amount);
        } 
        try{
            const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            const data = await response.json();
            return data.rates[toCurrency.code];
        } catch (error) {
                console.log("error", error);
        }
    }    
        populateCurrencySelects() {
            const fromSelect = document.getElementById('from-currency');
            const toSelect = document.getElementById('to-currency');
            this.currencies.forEach(currency => {
                const optionFrom = document.createElement('option');
                optionFrom.value = currency.code;
                optionFrom.textContent = `${currency.code} - ${currency.name}`;
                fromSelect.appendChild(optionFrom);
    
                const optionTo = document.createElement('option');
                optionTo.value = currency.code;
                optionTo.textContent = `${currency.code} - ${currency.name}`;
                toSelect.appendChild(optionTo);
            });
        }
}
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
