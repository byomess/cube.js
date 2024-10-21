#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { Eloqube } from '../core/eloqube';
import { TerminalEloqube } from '../renderers/terminal';
import { ArgDefinition, ArgsParser } from '../utils/args-parser';

const argsDefinition: ArgDefinition[] = [
    { name: 'fps', alias: 'f', type: 'number', default: 30, required: false },
    { name: 'width', alias: 'w', type: 'number', default: process.stdout.columns || 80, required: false },
    { name: 'height', alias: 'h', type: 'number', default: process.stdout.rows || 24, required: false },
    { name: 'size', alias: 's', type: 'number', default: (process.stdout.rows || 80) / 2, required: false },
    { name: 'distance', alias: 'd', type: 'number', default: 60, required: false },
    { name: 'help', alias: 'h', type: 'no-value', default: false, required: false }
];

const argsParser = new ArgsParser(argsDefinition);
const { fps, width, height, distance, size, help } = argsParser.parsedArgs;

if (help) {
    const helpText = fs.readFileSync(path.join(__dirname, '..', 'help.txt'), 'utf-8');
    console.log(helpText);
    process.exit(0);
}

const eloqube = new Eloqube(
    width as number,
    height as number,
    (size as number) / 2,
    distance as number
);
const terminalEloqube = new TerminalEloqube(eloqube, {
    fps: fps as number,
    width: width as number,
    height: height as number,
    distance: distance as number
});

terminalEloqube.animate();
