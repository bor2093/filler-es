export interface TextEaterSettings {
	deepseekApiKey: string;
	googleApiKey: string;
	apiProvider: 'google';
	useShardedFileStructure: boolean;
	dictionaryFolderPath: string;
}

export const DEFAULT_SETTINGS: TextEaterSettings = {
	deepseekApiKey: '',
	googleApiKey: '',
	apiProvider: 'google',
	useShardedFileStructure: false,
	dictionaryFolderPath: 'words',
};
