module Settlers {

    /** View for debugging the lib files */
    export class LibView {

        public elements: ElementProvider  = new ElementProvider();
        private log: LogHandler = new LogHandler("LibView");
        private rootPath: string;
        private libReader: LibFileReader;

        constructor(rootPath: string) {
            this.rootPath = rootPath;
        }


        public showLibFile(fileIndex:string) {
            let fileInfo = this.libReader.getFileInfo(parseInt(fileIndex));

            let infoText = fileInfo.toString();

            if (!fileInfo.checkChecksum()) {
                infoText += "  -- Checksumm missmatch! --";
                this.log.log("Checksumm missmatch!");
            }

            let reader = fileInfo.getReader();

            this.elements.get<HTMLElement>("info").innerText = infoText;
            this.elements.get<HTMLElement>("Content").innerText = reader.readString();
        }

        
        private fillUiList(libReader: LibFileReader) {
            let list = this.elements.get<HTMLSelectElement>("list");
            
            HtmlHelper.clearList(list);
            list.add(new Option("-- select file --"));
            
            let l = libReader.getFileCount();

            for (let i = 0; i < l; i++) {
                let fileInfo = libReader.getFileInfo(i);
                
                let item = new Option(fileInfo.getFullName() + " . . . . . . . . . . . . ["+ fileInfo.decompressedLength +"]", ""+ i);
                list.add(item);
            }
        }


        /** load a new game/level */
        public load(sourcePath: string) {
            let fileProvider = new FileProvider(this.rootPath);

            fileProvider.loadBinary(sourcePath).then((b) => {
                this.libReader = new LibFileReader(b);
                
                this.fillUiList(this.libReader);
            });
        };

    }



}
