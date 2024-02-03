
// ==UserScript==
// @name			Infinite Craft Helper
// @namespace		mikarific.com
// @match			https://neal.fun/infinite-craft/*
// @version			1.4
// @author			Mikarific
// @description		A script to add combination saving, element searching, and more to Infinite Craft.
// @grant			GM.setValue
// @grant			GM.getValue
// @grant			GM.deleteValue
// @downloadURL		https://github.com/Mikarific/InfiniteCraftHelper/raw/main/dist/InfiniteCraftHelper.user.js
// @updateURL		https://github.com/Mikarific/InfiniteCraftHelper/raw/main/dist/InfiniteCraftHelper.user.js
//
// Created with love using Gorilla
// ==/UserScript==

(function () {
    'use strict';

    const css = `
    .search-bar-container {
        display: flex;
        position: sticky;
        top: 0px;
        background: #fff;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        padding: 9px;
    }

    .search-bar {
        margin: 4px;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-block;
        border: 1px solid #c8c8c8;
        width: 100%;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
    }

    .instruction {
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto !important;
    }

    .import-state {
        margin: 12px;
        cursor: pointer;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-block;
        user-select: none;
        border: 1px solid #c8c8c8;
        background: #fff;
        line-height: 1em;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        width: max-content;
    }

    .import-state:hover {
        background:linear-gradient(0deg,#d6fcff,#fff 90%);
        border: 1px solid #91a8c1
    }

    .logo {
        position: fixed;
        top: 10px;
        right: 320px;
        width: 80px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
    }

    .download-icon {
        width: 21px;
        cursor: pointer;
        opacity: .8;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    .download-icon:hover {
        transform: scale(1.05)
    }
`;
    function init$5() {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css.trim()));
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    const characterMap = {
        À: 'A',
        Á: 'A',
        Â: 'A',
        Ã: 'A',
        Ä: 'A',
        Å: 'A',
        Ấ: 'A',
        Ắ: 'A',
        Ẳ: 'A',
        Ẵ: 'A',
        Ặ: 'A',
        Æ: 'AE',
        Ầ: 'A',
        Ằ: 'A',
        Ȃ: 'A',
        Ả: 'A',
        Ạ: 'A',
        Ẩ: 'A',
        Ẫ: 'A',
        Ậ: 'A',
        Ç: 'C',
        Ḉ: 'C',
        È: 'E',
        É: 'E',
        Ê: 'E',
        Ë: 'E',
        Ế: 'E',
        Ḗ: 'E',
        Ề: 'E',
        Ḕ: 'E',
        Ḝ: 'E',
        Ȇ: 'E',
        Ẻ: 'E',
        Ẽ: 'E',
        Ẹ: 'E',
        Ể: 'E',
        Ễ: 'E',
        Ệ: 'E',
        Ì: 'I',
        Í: 'I',
        Î: 'I',
        Ï: 'I',
        Ḯ: 'I',
        Ȋ: 'I',
        Ỉ: 'I',
        Ị: 'I',
        Ð: 'D',
        Ñ: 'N',
        Ò: 'O',
        Ó: 'O',
        Ô: 'O',
        Õ: 'O',
        Ö: 'O',
        Ø: 'O',
        Ố: 'O',
        Ṍ: 'O',
        Ṓ: 'O',
        Ȏ: 'O',
        Ỏ: 'O',
        Ọ: 'O',
        Ổ: 'O',
        Ỗ: 'O',
        Ộ: 'O',
        Ờ: 'O',
        Ở: 'O',
        Ỡ: 'O',
        Ớ: 'O',
        Ợ: 'O',
        Ù: 'U',
        Ú: 'U',
        Û: 'U',
        Ü: 'U',
        Ủ: 'U',
        Ụ: 'U',
        Ử: 'U',
        Ữ: 'U',
        Ự: 'U',
        Ý: 'Y',
        à: 'a',
        á: 'a',
        â: 'a',
        ã: 'a',
        ä: 'a',
        å: 'a',
        ấ: 'a',
        ắ: 'a',
        ẳ: 'a',
        ẵ: 'a',
        ặ: 'a',
        æ: 'ae',
        ầ: 'a',
        ằ: 'a',
        ȃ: 'a',
        ả: 'a',
        ạ: 'a',
        ẩ: 'a',
        ẫ: 'a',
        ậ: 'a',
        ç: 'c',
        ḉ: 'c',
        è: 'e',
        é: 'e',
        ê: 'e',
        ë: 'e',
        ế: 'e',
        ḗ: 'e',
        ề: 'e',
        ḕ: 'e',
        ḝ: 'e',
        ȇ: 'e',
        ẻ: 'e',
        ẽ: 'e',
        ẹ: 'e',
        ể: 'e',
        ễ: 'e',
        ệ: 'e',
        ì: 'i',
        í: 'i',
        î: 'i',
        ï: 'i',
        ḯ: 'i',
        ȋ: 'i',
        ỉ: 'i',
        ị: 'i',
        ð: 'd',
        ñ: 'n',
        ò: 'o',
        ó: 'o',
        ô: 'o',
        õ: 'o',
        ö: 'o',
        ø: 'o',
        ố: 'o',
        ṍ: 'o',
        ṓ: 'o',
        ȏ: 'o',
        ỏ: 'o',
        ọ: 'o',
        ổ: 'o',
        ỗ: 'o',
        ộ: 'o',
        ờ: 'o',
        ở: 'o',
        ỡ: 'o',
        ớ: 'o',
        ợ: 'o',
        ù: 'u',
        ú: 'u',
        û: 'u',
        ü: 'u',
        ủ: 'u',
        ụ: 'u',
        ử: 'u',
        ữ: 'u',
        ự: 'u',
        ý: 'y',
        ÿ: 'y',
        Ā: 'A',
        ā: 'a',
        Ă: 'A',
        ă: 'a',
        Ą: 'A',
        ą: 'a',
        Ć: 'C',
        ć: 'c',
        Ĉ: 'C',
        ĉ: 'c',
        Ċ: 'C',
        ċ: 'c',
        Č: 'C',
        č: 'c',
        C̆: 'C',
        c̆: 'c',
        Ď: 'D',
        ď: 'd',
        Đ: 'D',
        đ: 'd',
        Ē: 'E',
        ē: 'e',
        Ĕ: 'E',
        ĕ: 'e',
        Ė: 'E',
        ė: 'e',
        Ę: 'E',
        ę: 'e',
        Ě: 'E',
        ě: 'e',
        Ĝ: 'G',
        Ǵ: 'G',
        ĝ: 'g',
        ǵ: 'g',
        Ğ: 'G',
        ğ: 'g',
        Ġ: 'G',
        ġ: 'g',
        Ģ: 'G',
        ģ: 'g',
        Ĥ: 'H',
        ĥ: 'h',
        Ħ: 'H',
        ħ: 'h',
        Ḫ: 'H',
        ḫ: 'h',
        Ĩ: 'I',
        ĩ: 'i',
        Ī: 'I',
        ī: 'i',
        Ĭ: 'I',
        ĭ: 'i',
        Į: 'I',
        į: 'i',
        İ: 'I',
        ı: 'i',
        Ĳ: 'IJ',
        ĳ: 'ij',
        Ĵ: 'J',
        ĵ: 'j',
        Ķ: 'K',
        ķ: 'k',
        Ḱ: 'K',
        ḱ: 'k',
        K̆: 'K',
        k̆: 'k',
        Ĺ: 'L',
        ĺ: 'l',
        Ļ: 'L',
        ļ: 'l',
        Ľ: 'L',
        ľ: 'l',
        Ŀ: 'L',
        ŀ: 'l',
        Ł: 'l',
        ł: 'l',
        Ḿ: 'M',
        ḿ: 'm',
        M̆: 'M',
        m̆: 'm',
        Ń: 'N',
        ń: 'n',
        Ņ: 'N',
        ņ: 'n',
        Ň: 'N',
        ň: 'n',
        ŉ: 'n',
        N̆: 'N',
        n̆: 'n',
        Ō: 'O',
        ō: 'o',
        Ŏ: 'O',
        ŏ: 'o',
        Ő: 'O',
        ő: 'o',
        Œ: 'OE',
        œ: 'oe',
        P̆: 'P',
        p̆: 'p',
        Ŕ: 'R',
        ŕ: 'r',
        Ŗ: 'R',
        ŗ: 'r',
        Ř: 'R',
        ř: 'r',
        R̆: 'R',
        r̆: 'r',
        Ȓ: 'R',
        ȓ: 'r',
        Ś: 'S',
        ś: 's',
        Ŝ: 'S',
        ŝ: 's',
        Ş: 'S',
        Ș: 'S',
        ș: 's',
        ş: 's',
        Š: 'S',
        š: 's',
        Ţ: 'T',
        ţ: 't',
        ț: 't',
        Ț: 'T',
        Ť: 'T',
        ť: 't',
        Ŧ: 'T',
        ŧ: 't',
        T̆: 'T',
        t̆: 't',
        Ũ: 'U',
        ũ: 'u',
        Ū: 'U',
        ū: 'u',
        Ŭ: 'U',
        ŭ: 'u',
        Ů: 'U',
        ů: 'u',
        Ű: 'U',
        ű: 'u',
        Ų: 'U',
        ų: 'u',
        Ȗ: 'U',
        ȗ: 'u',
        V̆: 'V',
        v̆: 'v',
        Ŵ: 'W',
        ŵ: 'w',
        Ẃ: 'W',
        ẃ: 'w',
        X̆: 'X',
        x̆: 'x',
        Ŷ: 'Y',
        ŷ: 'y',
        Ÿ: 'Y',
        Y̆: 'Y',
        y̆: 'y',
        Ź: 'Z',
        ź: 'z',
        Ż: 'Z',
        ż: 'z',
        Ž: 'Z',
        ž: 'z',
        ſ: 's',
        ƒ: 'f',
        Ơ: 'O',
        ơ: 'o',
        Ư: 'U',
        ư: 'u',
        Ǎ: 'A',
        ǎ: 'a',
        Ǐ: 'I',
        ǐ: 'i',
        Ǒ: 'O',
        ǒ: 'o',
        Ǔ: 'U',
        ǔ: 'u',
        Ǖ: 'U',
        ǖ: 'u',
        Ǘ: 'U',
        ǘ: 'u',
        Ǚ: 'U',
        ǚ: 'u',
        Ǜ: 'U',
        ǜ: 'u',
        Ứ: 'U',
        ứ: 'u',
        Ṹ: 'U',
        ṹ: 'u',
        Ǻ: 'A',
        ǻ: 'a',
        Ǽ: 'AE',
        ǽ: 'ae',
        Ǿ: 'O',
        ǿ: 'o',
        Þ: 'TH',
        þ: 'th',
        Ṕ: 'P',
        ṕ: 'p',
        Ṥ: 'S',
        ṥ: 's',
        X́: 'X',
        x́: 'x',
        Ѓ: 'Г',
        ѓ: 'г',
        Ќ: 'К',
        ќ: 'к',
        A̋: 'A',
        a̋: 'a',
        E̋: 'E',
        e̋: 'e',
        I̋: 'I',
        i̋: 'i',
        Ǹ: 'N',
        ǹ: 'n',
        Ồ: 'O',
        ồ: 'o',
        Ṑ: 'O',
        ṑ: 'o',
        Ừ: 'U',
        ừ: 'u',
        Ẁ: 'W',
        ẁ: 'w',
        Ỳ: 'Y',
        ỳ: 'y',
        Ȁ: 'A',
        ȁ: 'a',
        Ȅ: 'E',
        ȅ: 'e',
        Ȉ: 'I',
        ȉ: 'i',
        Ȍ: 'O',
        ȍ: 'o',
        Ȑ: 'R',
        ȑ: 'r',
        Ȕ: 'U',
        ȕ: 'u',
        B̌: 'B',
        b̌: 'b',
        Č̣: 'C',
        č̣: 'c',
        Ê̌: 'E',
        ê̌: 'e',
        F̌: 'F',
        f̌: 'f',
        Ǧ: 'G',
        ǧ: 'g',
        Ȟ: 'H',
        ȟ: 'h',
        J̌: 'J',
        ǰ: 'j',
        Ǩ: 'K',
        ǩ: 'k',
        M̌: 'M',
        m̌: 'm',
        P̌: 'P',
        p̌: 'p',
        Q̌: 'Q',
        q̌: 'q',
        Ř̩: 'R',
        ř̩: 'r',
        Ṧ: 'S',
        ṧ: 's',
        V̌: 'V',
        v̌: 'v',
        W̌: 'W',
        w̌: 'w',
        X̌: 'X',
        x̌: 'x',
        Y̌: 'Y',
        y̌: 'y',
        A̧: 'A',
        a̧: 'a',
        B̧: 'B',
        b̧: 'b',
        Ḑ: 'D',
        ḑ: 'd',
        Ȩ: 'E',
        ȩ: 'e',
        Ɛ̧: 'E',
        ɛ̧: 'e',
        Ḩ: 'H',
        ḩ: 'h',
        I̧: 'I',
        i̧: 'i',
        Ɨ̧: 'I',
        ɨ̧: 'i',
        M̧: 'M',
        m̧: 'm',
        O̧: 'O',
        o̧: 'o',
        Q̧: 'Q',
        q̧: 'q',
        U̧: 'U',
        u̧: 'u',
        X̧: 'X',
        x̧: 'x',
        Z̧: 'Z',
        z̧: 'z',
        й: 'и',
        Й: 'И',
        ё: 'е',
        Ё: 'Е',
    };
    function removeAccents(string) {
        return string.replace(new RegExp(Object.keys(characterMap).join('|'), 'g'), (char) => {
            return characterMap[char];
        });
    }
    const rankings = {
        CASE_SENSITIVE_EQUAL: 7,
        EQUAL: 6,
        STARTS_WITH: 5,
        WORD_STARTS_WITH: 4,
        CONTAINS: 3,
        ACRONYM: 2,
        MATCHES: 1,
        NO_MATCH: 0,
    };
    const defaultBaseSortFn = (a, b) => String(a.rankedValue).localeCompare(String(b.rankedValue));
    function matchSorter(items, value, options = {}) {
        const { keys, threshold = rankings.MATCHES, baseSort = defaultBaseSortFn, sorter = (matchedItems) => matchedItems.sort((a, b) => sortRankedValues(a, b, baseSort)) } = options;
        const matchedItems = items.reduce(reduceItemsToRanked, []);
        return sorter(matchedItems).map(({ item }) => item);
        function reduceItemsToRanked(matches, item, index) {
            const rankingInfo = getHighestRanking(item, keys, value, options);
            const { rank, keyThreshold = threshold } = rankingInfo;
            if (rank >= keyThreshold) {
                matches.push({ ...rankingInfo, item, index });
            }
            return matches;
        }
    }
    matchSorter.rankings = rankings;
    function getHighestRanking(item, keys, value, options) {
        if (!keys) {
            const stringItem = item;
            return {
                rankedValue: stringItem,
                rank: getMatchRanking(stringItem, value, options),
                keyIndex: -1,
                keyThreshold: options.threshold,
            };
        }
        const valuesToRank = getAllValuesToRank(item, keys);
        return valuesToRank.reduce(({ rank, rankedValue, keyIndex, keyThreshold }, { itemValue, attributes }, i) => {
            let newRank = getMatchRanking(itemValue, value, options);
            let newRankedValue = rankedValue;
            const { minRanking, maxRanking, threshold } = attributes;
            if (newRank < minRanking && newRank >= rankings.MATCHES) {
                newRank = minRanking;
            }
            else if (newRank > maxRanking) {
                newRank = maxRanking;
            }
            if (newRank > rank) {
                rank = newRank;
                keyIndex = i;
                keyThreshold = threshold;
                newRankedValue = itemValue;
            }
            return { rankedValue: newRankedValue, rank, keyIndex, keyThreshold };
        }, {
            rankedValue: item,
            rank: rankings.NO_MATCH,
            keyIndex: -1,
            keyThreshold: options.threshold,
        });
    }
    function getMatchRanking(testString, stringToRank, options) {
        testString = prepareValueForComparison(testString, options);
        stringToRank = prepareValueForComparison(stringToRank, options);
        if (stringToRank.length > testString.length) {
            return rankings.NO_MATCH;
        }
        if (testString === stringToRank) {
            return rankings.CASE_SENSITIVE_EQUAL;
        }
        testString = testString.toLowerCase();
        stringToRank = stringToRank.toLowerCase();
        if (testString === stringToRank) {
            return rankings.EQUAL;
        }
        if (testString.startsWith(stringToRank)) {
            return rankings.STARTS_WITH;
        }
        if (testString.includes(` ${stringToRank}`)) {
            return rankings.WORD_STARTS_WITH;
        }
        if (testString.includes(stringToRank)) {
            return rankings.CONTAINS;
        }
        else if (stringToRank.length === 1) {
            return rankings.NO_MATCH;
        }
        if (getAcronym(testString).includes(stringToRank)) {
            return rankings.ACRONYM;
        }
        return getClosenessRanking(testString, stringToRank);
    }
    function getAcronym(string) {
        let acronym = '';
        const wordsInString = string.split(' ');
        wordsInString.forEach((wordInString) => {
            const splitByHyphenWords = wordInString.split('-');
            splitByHyphenWords.forEach((splitByHyphenWord) => {
                acronym += splitByHyphenWord.substr(0, 1);
            });
        });
        return acronym;
    }
    function getClosenessRanking(testString, stringToRank) {
        let matchingInOrderCharCount = 0;
        let charNumber = 0;
        function findMatchingCharacter(matchChar, string, index) {
            for (let j = index, J = string.length; j < J; j++) {
                const stringChar = string[j];
                if (stringChar === matchChar) {
                    matchingInOrderCharCount += 1;
                    return j + 1;
                }
            }
            return -1;
        }
        function getRanking(spread) {
            const spreadPercentage = 1 / spread;
            const inOrderPercentage = matchingInOrderCharCount / stringToRank.length;
            const ranking = rankings.MATCHES + inOrderPercentage * spreadPercentage;
            return ranking;
        }
        const firstIndex = findMatchingCharacter(stringToRank[0], testString, 0);
        if (firstIndex < 0) {
            return rankings.NO_MATCH;
        }
        charNumber = firstIndex;
        for (let i = 1, I = stringToRank.length; i < I; i++) {
            const matchChar = stringToRank[i];
            charNumber = findMatchingCharacter(matchChar, testString, charNumber);
            const found = charNumber > -1;
            if (!found) {
                return rankings.NO_MATCH;
            }
        }
        const spread = charNumber - firstIndex;
        return getRanking(spread);
    }
    function sortRankedValues(a, b, baseSort) {
        const aFirst = -1;
        const bFirst = 1;
        const { rank: aRank, keyIndex: aKeyIndex } = a;
        const { rank: bRank, keyIndex: bKeyIndex } = b;
        const same = aRank === bRank;
        if (same) {
            if (aKeyIndex === bKeyIndex) {
                return baseSort(a, b);
            }
            else {
                return aKeyIndex < bKeyIndex ? aFirst : bFirst;
            }
        }
        else {
            return aRank > bRank ? aFirst : bFirst;
        }
    }
    function prepareValueForComparison(value, { keepDiacritics }) {
        value = `${value}`;
        if (!keepDiacritics) {
            value = removeAccents(value);
        }
        return value;
    }
    function getItemValues(item, key) {
        if (typeof key === 'object') {
            key = key.key;
        }
        let value;
        if (typeof key === 'function') {
            value = key(item);
        }
        else if (item == null) {
            value = null;
        }
        else if (Object.hasOwn(item, key)) {
            value = item[key];
        }
        else if (key.includes('.')) {
            return getNestedValues(key, item);
        }
        else {
            value = null;
        }
        if (value == null) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [String(value)];
    }
    function getNestedValues(path, item) {
        const keys = path.split('.');
        let values = [item];
        for (let i = 0, I = keys.length; i < I; i++) {
            const nestedKey = keys[i];
            let nestedValues = [];
            for (let j = 0, J = values.length; j < J; j++) {
                const nestedItem = values[j];
                if (nestedItem == null)
                    continue;
                if (Object.hasOwn(nestedItem, nestedKey)) {
                    const nestedValue = nestedItem[nestedKey];
                    if (nestedValue != null) {
                        nestedValues.push(nestedValue);
                    }
                }
                else if (nestedKey === '*') {
                    nestedValues = nestedValues.concat(nestedItem);
                }
            }
            values = nestedValues;
        }
        if (Array.isArray(values[0])) {
            const result = [];
            return result.concat(...values);
        }
        return values;
    }
    function getAllValuesToRank(item, keys) {
        const allValues = [];
        for (let j = 0, J = keys.length; j < J; j++) {
            const key = keys[j];
            const attributes = getKeyAttributes(key);
            const itemValues = getItemValues(item, key);
            for (let i = 0, I = itemValues.length; i < I; i++) {
                allValues.push({
                    itemValue: itemValues[i],
                    attributes,
                });
            }
        }
        return allValues;
    }
    const defaultKeyAttributes = {
        maxRanking: Infinity,
        minRanking: -Infinity,
    };
    function getKeyAttributes(key) {
        if (typeof key === 'string') {
            return defaultKeyAttributes;
        }
        return { ...defaultKeyAttributes, ...key };
    }

    function init$4(elements) {
        const searchBarContainer = document.createElement('div');
        searchBarContainer.classList.add('search-bar-container');
        elements.sidebar.prepend(searchBarContainer);
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Search...';
        searchBar.classList.add('search-bar');
        searchBarContainer.appendChild(searchBar);
        elements.sideControls.style.backgroundColor = '#fff';
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value;
            const items = elements.getItems();
            if (query !== '') {
                items.forEach((item) => {
                    item.style.display = 'none';
                });
                const sorted = matchSorter(items, query, { keys: [(item) => item.childNodes[1].textContent?.trim() ?? ''] });
                let previousElement = null;
                sorted.forEach((element) => {
                    element.style.display = '';
                    if (previousElement !== null) {
                        previousElement.after(element);
                    }
                    else {
                        elements.items.prepend(element);
                    }
                    previousElement = element;
                });
            }
            else {
                items.forEach((item) => {
                    item.style.display = '';
                });
                elements.sort.click();
                setTimeout(() => {
                    elements.sort.click();
                }, 1);
            }
        });
    }

    function exportState() {
        return {
            discoveries: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.discoveries,
            elements: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
        };
    }
    async function init$3(domElements) {
        if (domElements.instruction !== null) {
            const importState = document.createElement('button');
            importState.innerText = 'Import State';
            importState.classList.add('import-state');
            domElements.instruction.innerHTML = '';
            domElements.instruction.appendChild(importState);
            domElements.instruction.appendChild(document.createTextNode('Crafting any elements will overwrite your state!'));
            importState.addEventListener('click', async (e) => {
                const discoveries = await GM.getValue('discoveries');
                const elements = await GM.getValue('elements');
                if (discoveries !== undefined && elements !== undefined) {
                    const gameData = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data;
                    gameData.discoveries = discoveries;
                    gameData.elements = elements;
                    domElements.instruction.remove();
                }
            });
        }
        const observer = new MutationObserver(async () => {
            const { discoveries, elements } = exportState();
            await GM.setValue('discoveries', discoveries);
            await GM.setValue('elements', elements);
        });
        observer.observe(domElements.sidebar, { childList: true, subtree: true });
        const discoveries = await GM.getValue('discoveries');
        const elements = await GM.getValue('elements');
        if (discoveries === undefined || elements === undefined) {
            const oldState = await GM.getValue('state');
            if (oldState !== undefined) {
                const oldStateParsed = JSON.parse(oldState);
                await GM.setValue('discoveries', oldStateParsed.discoveries);
                await GM.setValue('elements', oldStateParsed.elements);
                await GM.deleteValue('state');
            }
            else {
                const initialState = exportState();
                await GM.setValue('discoveries', initialState.discoveries);
                await GM.setValue('elements', initialState.elements);
            }
        }
    }

    let middleMouseDown = false;
    let middleClickedElementString = null;
    let teleportX = 0;
    let teleportY = 0;
    function init$2(elements) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (middleMouseDown && node instanceof HTMLDivElement && node.childNodes.length >= 2 && node.childNodes[1].textContent?.trim() === middleClickedElementString) {
                            node.style.translate = `${teleportX - node.clientWidth / 2}px ${teleportY - node.clientHeight / 2}px`;
                        }
                        node.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            if (e instanceof MouseEvent && e.button === 1 && e.target instanceof HTMLDivElement && e.target.childNodes.length >= 2) {
                                const targetElement = e.target;
                                targetElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                                middleClickedElementString = targetElement.childNodes[1].textContent?.trim() ?? null;
                                const newElement = elements.getItems().find((el) => el.childNodes[1].textContent?.trim() === middleClickedElementString);
                                const { x, y, width, height } = newElement?.getBoundingClientRect();
                                newElement?.dispatchEvent(new MouseEvent('mousedown', {
                                    clientX: x + width / 2,
                                    clientY: y + height / 2,
                                }));
                                middleMouseDown = true;
                                teleportX = e.clientX;
                                teleportY = e.clientY;
                            }
                        });
                    });
                }
            });
        });
        observer.observe(elements.instances, { childList: true, subtree: true });
        document.addEventListener('mouseup', (e) => {
            if (e.button === 1) {
                middleMouseDown = false;
            }
        });
    }

    const downloadIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgNjAwIj48cGF0aCBkPSJNMzAwLDQzOS4yMDMyMmMtNC42MTU3MywwLTguODczOTQtLjc1NTM0LTEyLjc3NDY1LTIuMjY2MDYtMy45MDE0Mi0xLjUxMTQ0LTcuNzE5OTktNC4xMzQ5OC0xMS40NTU3LTcuODcwNzJsLTExMi4yNTM1Ni0xMTIuMjUzNTZjLTQuMTc1NzItNC4xNzU3Mi02LjM1OTY1LTkuMDkzMjUtNi41NTE3OC0xNC43NTI1MS0uMTkyODUtNS42NTkzLDEuOTkxMDgtMTAuODUxNzgsNi41NTE3OC0xNS41Nzc1LDQuNzI1NjktNC43MjUsOS44MjE3OC03LjEyODkyLDE1LjI4ODIzLTcuMjExNzcsNS40NjcxNC0uMDgyMTcsMTAuNTYzNTgsMi4yMzk2NywxNS4yODkyNyw2Ljk2NTM2bDg0LjQ3NzgzLDg0LjQ3NzgzVjIxLjQyODU3YzAtNi4wOTkzMSwyLjA0Njc2LTExLjE5NTMzLDYuMTQwMzQtMTUuMjg4MTksNC4wOTI4Ni00LjA5MzU4LDkuMTg4OTUtNi4xNDAzOCwxNS4yODgyMy02LjE0MDM4czExLjE5NTM2LDIuMDQ2NzksMTUuMjg4MjMsNi4xNDAzOGM0LjA5MzU4LDQuMDkyODYsNi4xNDAzNCw5LjE4ODg5LDYuMTQwMzQsMTUuMjg4MTlWMzcwLjcxNDI5bDg0LjQ3Nzg3LTg0LjQ3Nzg3YzQuMTc1NzItNC4xNzY0MSw5LjEzNDYxLTYuMzYwNzIsMTQuODc2OC02LjU1Mjg1LDUuNzQxNC0uMTkyMTYsMTAuOTc1MDEsMi4wNzQyOSwxNS43MDA3MSw2Ljc5OTI5LDQuNTYwNyw0LjcyNTcyLDYuODgyMTUsOS43ODA3MSw2Ljk2NDI5LDE1LjE2NDk5LC4wODIxNCw1LjM4NS0yLjIzOTMxLDEwLjQzOTk5LTYuOTY0MjksMTUuMTY0OTlsLTExMi4yNTM1NiwxMTIuMjUzNTZjLTMuNzM1NzQsMy43MzU3MS03LjU1NDI4LDYuMzU5MjktMTEuNDU1Nyw3Ljg3MDcyLTMuOTAwNywxLjUxMDcyLTguMTU4OTUsMi4yNjYwNi0xMi43NzQ2OCwyLjI2NjA5Wm0tMjMwLjc2OTY1LDE2MC43OTY3OGMtMTkuNzI0OTksMC0zNi4xOTQ2NC02LjYwNzE1LTQ5LjQwODkyLTE5LjgyMTQzLTEzLjIxNDI4LTEzLjIxNDI4LTE5LjgyMTQzLTI5LjY4MzkzLTE5LjgyMTQzLTQ5LjQwODkydi04Mi40MTc1YzAtNi4wOTkzMSwyLjA0Njc5LTExLjE5NTY5LDYuMTQwMzYtMTUuMjg5MjcsNC4wOTI4Ni00LjA5MjksOS4xODg5Mi02LjEzOTMsMTUuMjg4MjEtNi4xMzkzLDYuMDk4NTcsMCwxMS4xOTQ2MywyLjA0NjQsMTUuMjg4MjEsNi4xMzkzLDQuMDkzNTcsNC4wOTM1OCw2LjE0MDM2LDkuMTg5OTcsNi4xNDAzNiwxNS4yODkyN3Y4Mi40MTc1YzAsNi41OTI4NCwyLjc0NzE1LDEyLjYzNjc4LDguMjQxNDMsMTguMTMxNzksNS40OTUsNS40OTQyNiwxMS41Mzg5Myw4LjI0MTQxLDE4LjEzMTc3LDguMjQxNDFoNDYxLjUzOTMxYzYuNTkyODQsMCwxMi42MzY4My0yLjc0NzE1LDE4LjEzMTc2LTguMjQxNDMsNS40OTQzNC01LjQ5NSw4LjI0MTQ1LTExLjUzODkzLDguMjQxNDUtMTguMTMxNzd2LTgyLjQxNzVjMC02LjA5OTMxLDIuMDQ2NzktMTEuMTk1NjksNi4xNDAzOC0xNS4yODkyNyw0LjA5MzU4LTQuMDkyOSw5LjE4OTY3LTYuMTM5MywxNS4yODgxOS02LjEzOTMsNi4wOTkzMSwwLDExLjE5NTMzLDIuMDQ2NCwxNS4yODgxOSw2LjEzOTMsNC4wOTM1OCw0LjA5MzU4LDYuMTQwMzgsOS4xODk5Nyw2LjE0MDM4LDE1LjI4OTI3djgyLjQxNzVjMCwxOS43MjQ5OS02LjYwNzE2LDM2LjE5NDY0LTE5LjgyMTQzLDQ5LjQwODkyLTEzLjIxNDI2LDEzLjIxNDI4LTI5LjY4Mzk1LDE5LjgyMTQzLTQ5LjQwODkyLDE5LjgyMTQzSDY5LjIzMDM1WiIvPjwvc3ZnPg==';
    function init$1(elements) {
        const download = document.createElement('img');
        download.src = downloadIcon.trim();
        download.classList.add('download-icon');
        elements.sideControls.prepend(download);
        download.addEventListener('click', async (e) => {
            const downloadLink = document.createElement('a');
            downloadLink.download = 'infinitecraft.json';
            downloadLink.href = URL.createObjectURL(new Blob([
                JSON.stringify({
                    discoveries: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.discoveries,
                    elements: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
                }, null, '\t'),
            ], { type: 'application/json' }));
            downloadLink.dataset.downloadurl = ['application/json', downloadLink.download, downloadLink.href].join(':');
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            setTimeout(function () {
                URL.revokeObjectURL(downloadLink.href);
            }, 1500);
        });
    }

    const logo = 'data:image/png;base64,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';
    function init(elements) {
        elements.logo.src = logo.trim();
    }

    window.addEventListener('load', async () => {
        const elements = {
            instances: document.querySelector('.instances'),
            sidebar: document.querySelector('.sidebar'),
            items: document.querySelector('.items'),
            getItems: () => {
                return Array.from(document.querySelectorAll('.items div.item'));
            },
            instruction: document.querySelector('.instruction'),
            sidebarControls: document.querySelector('.sidebar-controls'),
            sort: document.querySelector('.sort'),
            sideControls: document.querySelector('.side-controls'),
            logo: document.querySelector('.logo'),
        };
        init$5();
        init$4(elements);
        await init$3(elements);
        init$2(elements);
        init$1(elements);
        init(elements);
    }, false);

})();
