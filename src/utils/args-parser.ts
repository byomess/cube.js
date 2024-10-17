export interface ArgDefinition {
    type: 'string' | 'number' | 'boolean' | 'no-value';
    name: string;
    alias?: string;
    default?: any;
    required?: boolean;
    description?: string;
};

export interface ParsedArgs {
    [key: string]: string | number | boolean;
}

export class ArgsParser {
    public readonly parsedArgs: ParsedArgs;
        
    constructor(
        public readonly argsDefinition: ArgDefinition[],
        public readonly args = process.argv.slice(2)
    ) {
        this.validateArgs();
        this.parsedArgs = this.parseArgs(this.args);
    }

    private validateArgs() {
        this.argsDefinition.forEach(({ name, required }) => {
            if (required && !this.args.some(arg => arg.startsWith(`--${name}`))) {
                throw new Error(`Argument ${name} is required`);
            }
        });
    }

    private parseArgs(args: string[]): ParsedArgs {
        // Initial parsed args object with default values:
        const initialParsedArgs = this.argsDefinition.reduce((acc, { name, default: defaultValue }) => {
            acc[name] = defaultValue;
            return acc;
        }, {} as ParsedArgs);

        const parsedArgs = args.reduce((acc, arg) => {
            if (arg.startsWith('--')) {
                let nameOrAlias = arg.slice(2);
                if (nameOrAlias.includes('=')) {
                    nameOrAlias = nameOrAlias.split('=')[0];
                }
                const argDefinition = this.argsDefinition.find(({ name, alias }) => name === nameOrAlias || alias === nameOrAlias);
                
                if (!argDefinition) {
                    throw new Error(`Unknown argument: ${arg}`);
                }

                if (argDefinition.type === 'no-value') {
                    acc[argDefinition.name] = true;
                } else {
                    const valueAsNextArg = args[args.indexOf(arg) + 1];
                    const valueAsAfterEqual = arg.split('=')[1];
                    const value = valueAsNextArg || valueAsAfterEqual || argDefinition.default;

                    if (!value) {
                        throw new Error(`Value for argument ${arg} is missing`);
                    }

                    switch (argDefinition.type) {
                        case 'string':
                            acc[argDefinition.name] = value;
                            break;
                        case 'number':
                            acc[argDefinition.name] = Number(value);
                            break;
                        case 'boolean':
                            acc[argDefinition.name] = value === 'true';
                            break;
                        default:
                            break;
                    }
                }
            }

            return acc;
        }, {} as ParsedArgs);

        return { ...initialParsedArgs, ...parsedArgs };
    }
}