#!/usr/bin/env node

import { Eloqube } from '../core/eloqube';
import { TerminalEloqube } from '../renderers/terminal';

import CONFIG from '../../config.json';

const { FPS } = CONFIG;

const eloqube = new Eloqube();
const terminalEloqube = new TerminalEloqube(eloqube, { fps: FPS });

terminalEloqube.animate();
