import { v4 as uuidv4 } from 'uuid';
export class Post {
    
    private uuid: string
    constructor() {
        this.uuid = uuidv4()
    
    }
}