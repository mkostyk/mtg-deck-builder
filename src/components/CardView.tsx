import { useEffect, useState } from "react";
import { Typography, Grid } from '@mui/material';
import { requestPath } from "../utils";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const classes = {
    leftGridItem: {
        fontSize: 20,
        minHeight: 40,
        display: "flex",
        alignItems: "center",
        fontWeight: 600
    },

    rightGridItem: {
        fontSize: 20,
    }
};


function CardView() {
    const [image, setImage] = useState("");
    const [card, setCard] = useState<any>();
    const [manaObj, setManaString] = useState<any>();
    function createPricesData(
        type: string,
        eur: string,
        usd: string,
        tix: string
        ) {
        return { type, eur, usd, tix};
        }
    
    
    const [costs, setCosts] = useState(
        [createPricesData('Non-foil', "-","-", "-"),
        createPricesData('Foil', "-", "-", "-")]
    );

    function createLegalityData(
        format: string,
        legality: string
    ) {
        return {format, legality}
    }

    const [legalities, setLegalities] = useState([createLegalityData("Standard", "Illegal")]);

    //todo - można wyeksportować do jakichś utilsów
    const stringManaToArray = (manaString: []) => {
        let res = {cost: "", mana: []};
        for (let i = 0; i < manaString.length; ++i) {
            if (manaString[i] !== '{' && manaString[i] !== '}') {
                if ('0' <= manaString[i] && manaString[i] <= '9') {
                    res.cost += manaString[i];
                }
                else {
                    res.mana = [...res.mana, manaString[i]];
                }
            }
        }
        return res;
    }

    const fetchCardData = async () => {
        const cardFromLocalStorage = JSON.parse(localStorage.getItem("card") || "null")[0];
        setCard(cardFromLocalStorage);
        setManaString(stringManaToArray(cardFromLocalStorage.mana_cost))

        const cardRequest = await fetch(`${requestPath}/images/?id=${cardFromLocalStorage.id}`, {
            method: 'GET',
        });

        if(!cardRequest.ok) {
            return;
        }

        const cardJson = await cardRequest.json();

        setImage(cardJson.normal);

        fetchPrices(cardFromLocalStorage.id);
        fetchLegalities(cardFromLocalStorage.id);
        
    }

    const numberOrNull = (value: any) => {
        return value == null ? "-" : value; 
    }

    const fetchPrices = async (id: number) => {
        const prices = await fetch(`${requestPath}/prices/?id=${id}`, {
            method: 'GET',
        });

        if(!prices.ok) {
            return;
        }

        const pricesJson = (await prices.json())[0];

        const pricesTable = [createPricesData("Non-foil", numberOrNull(pricesJson.eur),  numberOrNull(pricesJson.usd), numberOrNull(pricesJson.tix)),
        createPricesData("Foil", numberOrNull(pricesJson.eur_foil),  numberOrNull(pricesJson.usd_foil), numberOrNull(null))];

        setCosts(pricesTable);

    }

    const fetchLegalities = async (id: number) => {
        const legalities = await fetch(`${requestPath}/legalities/?id=${id}`, {
            method: 'GET',
        });

        if(!legalities.ok) {
            return;
        }

        const prettyString = (s: string) => {
            return s == "legal" ? "Legal" : "Not legal";
        }

        const legalitiesJson = await legalities.json();

        const legalitiesTable = [createLegalityData("Standard", prettyString(legalitiesJson.standard)),
        createLegalityData("Pioneer", prettyString(legalitiesJson.pioneer)),
        createLegalityData("Modern", prettyString(legalitiesJson.modern)),
        createLegalityData("Legacy", prettyString(legalitiesJson.legacy)),
        createLegalityData("Vintage", prettyString(legalitiesJson.vintage)),
        createLegalityData("Commander", prettyString(legalitiesJson.commander)),
        ];

        setLegalities(legalitiesTable);
    }

    useEffect(() => {
        fetchCardData();
    }, []);
    
    function CostsTable() {
    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
            <TableRow>
                <TableCell ><Typography fontWeight={600}>Prices</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={600}>EUR</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={600}>USD</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={600}>TIX</Typography></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {costs.map((row) => (
                <TableRow
                key={row.type}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {row.type}
                </TableCell>
                <TableCell align="right">{row.eur}</TableCell>
                <TableCell align="right">{row.usd}</TableCell>
                <TableCell align="right">{row.tix}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
    }

    function LegalityTable() {
        return (
            <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell><Typography fontWeight={600}>Format</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight={600}>Legality</Typography></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {legalities.map((row) => (
                    <TableRow
                    key={row.format}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.format}
                    </TableCell>
                    <TableCell align="right">{row.legality}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        );
        }

    const left = 3;

    return (
        <div style = {{padding: 20, display: "flex"}}>
            <div style = {{minWidth: "25%", maxWidth: "25%"}}>
                <img src = {image} style={{ width: "100%", height: "80%"}} alt = "card image"/>
            </div>
            <div>
                <div style = {{paddingLeft: 40, minWidth: "75%", paddingRight: 40}}>
                    <Typography
                        variant = "h4"
                        sx = {{padding: 4, paddingLeft: 0, width: "100%", display: "flex", /*justifyContent: "center"*/}}
                    >
                        Card summary
                    </Typography>
                    <Grid container>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Name
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? (card.card_name) : "card name"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Mana cost
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                        {!manaObj ? "" :
                        (manaObj.cost === '')
                            ? ''
                            : <img
                                alt = "manaCost"
                                src = {require(`../icons/${manaObj.cost}.png`)} style = {{width: 24, margin: 2}}
                                />
                        }
                        {!manaObj ? "" :
                        manaObj.mana.map((manaElem: any, key: any) => (
                            <img
                                key = {key}
                                alt = "manaElem"
                                src = {require(`../icons/${manaElem}.png`)} style = {{width: 24, margin: 2}}
                            />
                        ))}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Type line
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? (card.type_line) : "card type line"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Power/toughness
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? `${numberOrNull(card.power)}/${numberOrNull(card.toughness)}` : "card stats"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Text
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? (card.card_text) : "card text"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Flavor text
                        </Grid>
                        <Grid item xs = {12 - left} sx = {[classes.rightGridItem, {fontStyle: "italic"}]}>
                            {(card) ? (card.flavor_text) : "card flavor text"}
                        </Grid>
                    </Grid>
                </div>
                <div style = {{display: "flex", minWidth:"75%"}}>
                    <div style = {{margin: 40, marginTop: 10}}>
                        {CostsTable()}
                    </div>
                    <div style = {{margin: 40, marginTop: 10, paddingRight: 40}}>
                        {LegalityTable()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardView;