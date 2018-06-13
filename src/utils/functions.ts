import phantom = require('phantom');
import * as $ from 'jquery';
import opn = require('opn');

import { Ticket } from './Ticket';


export function wakeUp(ticketUrl: string, musicUrl: string): void {
    opn(ticketUrl);
    opn(musicUrl);
}


export function myLog(thing: any): void {
    function form(n: number): string {
        return ((n>=10)?'':'0') + String(n);
    }

    const d = new Date();
    // 01/05/2018 15:33:06
    const date = form(d.getDate())+'/'+form(d.getMonth()+1)+'/'+d.getFullYear()
        +' '
        +form(d.getHours())+':'+form(d.getMinutes())+':'+form(d.getSeconds());

    console.log(date, thing);
}


export async function isTicketAvaible(ticketUrl: string): Promise<boolean> {
    const instance = await phantom.create();
    const page = await instance.createPage();
    const status = await page.open(ticketUrl);
    const success = await page.evaluate(function () {
        const alert = $('#alerte_tab-mb_billets>*>.alert.alert-warning');
        const warning = 'Aucun billet d\'occasion disponible actuellement pour la representation Hellfest 2018 - Pass 3 jours. Des vendeurs peuvent à tout moment mettre des billets en vente. Indiquez votre adresse email ci-dessous pour être averti dès qu\'un billet sera disponible.';

        return !(alert.length === 1 && alert.text().trim() === warning);
    });

    await instance.exit();
    return success;
}


export function getTickets(): Array<Ticket> {
    const res: Array<Ticket> = [];
    const $trs = $('#tab-mb_billets>tbody>tr');

    $trs.each(function (i: number, elt: HTMLElement) {
        const $elt = $(elt);
        const $infos = $elt.children('td.td_boutton').first().children('div');

        if ($infos.length === 0) { return; }

        const regexp = /^ModalDetailsAnnonce_(.+)$/;
        const match = $infos.attr('id').match(regexp);
        const min30 = 1800;

        if (match.length === 0) { return; }

        const remain: number = (function () {
            var $cd = $infos.find('.countdown');

            if ($cd.length === 0) {
                $cd = $('#ModalAjoutPanier').find('.countdown');

                if ($cd.length === 0) { return min30; }
            }
            return parseInt($cd.attr('id'));
        })();

        const owner = $infos.find('.fa-user')
            .parent()   // div.icone-detail.annonce.vertical-middle
            .parent()   // div.span1
            .next()     // div.span11
            .children() // div.vertical-middle
            .text().trim();

        res.push({
            id: parseInt(match[1]),
            creationDate: Date.now() - 1000 * (min30 - remain),
            expirationDate: -1,
            owner: owner,
            price: parseInt($elt.find('td.td_prix .montant-numeric').text())
        });
    });

    return res;
}
