 import { Injectable } from '@nestjs/common'
 import { CreateItemInput, UpdateItemInput } from './dto/inputs'
 import { Item } from './entities/item.entity'
 import { InjectRepository } from '@nestjs/typeorm'
 import { Repository } from 'typeorm'

 @Injectable()
 export class ItemsService {
     constructor(
         @InjectRepository(Item)
         private itemsRepository: Repository<Item>
     ) {}
     //--------------------------------------------------------------------------------------------
     async create(createItemInput: CreateItemInput): Promise<Item> {

         const newItem = this.itemsRepository.create(createItemInput)
         await this.itemsRepository.save(newItem)
         return newItem

     }

     //--------------------------------------------------------------------------------------------

     async findAll(): Promise<Item[]> {

         return this.itemsRepository.find()

     }

     //--------------------------------------------------------------------------------------------

     async findOne(id: string): Promise<Item> {

         const item = await this.itemsRepository.findOne({ where: { id } })
         if (!item) {

             throw new Error(`Item with ID ${id} not found`)

         }
         return item

         //--------------------------------------------------------------------------------------------
     }

     async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {

         const { id: _, ...rest } = updateItemInput
         const item = await this.itemsRepository.preload({ id, ...rest })
         if (!item) {
             throw new Error(`Item with ID ${id} not found`)
         }
         return this.itemsRepository.save(item)
         
     }

     //--------------------------------------------------------------------------------------------

     async remove(id: string): Promise<Item> {

         const item = await this.findOne(id)
         await this.itemsRepository.remove(item)
         return { ...item, id }

     }

     //--------------------------------------------------------------------------------------------
 }
