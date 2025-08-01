import { ColumnDefinition, ColumnGroup, DEFAULT_COLUMNS, DEFAULT_COLUMN_GROUPS } from '../types/column'

export class ColumnService {
  private static STORAGE_KEY = 'rkas_columns'
  private static GROUPS_STORAGE_KEY = 'rkas_column_groups'

  // Column CRUD operations
  static getColumns(): ColumnDefinition[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_COLUMNS
      }
    }
    return DEFAULT_COLUMNS
  }

  static saveColumns(columns: ColumnDefinition[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(columns))
  }

  static addColumn(column: Omit<ColumnDefinition, 'id' | 'created_at' | 'updated_at'>): ColumnDefinition {
    const columns = this.getColumns()
    const newColumn: ColumnDefinition = {
      ...column,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    columns.push(newColumn)
    this.saveColumns(columns)
    return newColumn
  }

  static updateColumn(id: string, updates: Partial<ColumnDefinition>): ColumnDefinition | null {
    const columns = this.getColumns()
    const index = columns.findIndex(col => col.id === id)
    
    if (index === -1) return null
    
    columns[index] = {
      ...columns[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    this.saveColumns(columns)
    return columns[index]
  }

  static deleteColumn(id: string): boolean {
    const columns = this.getColumns()
    const filteredColumns = columns.filter(col => col.id !== id)
    
    if (filteredColumns.length === columns.length) return false
    
    this.saveColumns(filteredColumns)
    return true
  }

  static reorderColumns(columnIds: string[]): void {
    const columns = this.getColumns()
    const reorderedColumns = columnIds.map((id, index) => {
      const column = columns.find(col => col.id === id)
      if (column) {
        return { ...column, order: index + 1 }
      }
      return null
    }).filter(Boolean) as ColumnDefinition[]
    
    this.saveColumns(reorderedColumns)
  }

  static getVisibleColumns(): ColumnDefinition[] {
    return this.getColumns().filter(col => col.visible).sort((a, b) => a.order - b.order)
  }

  static getEditableColumns(): ColumnDefinition[] {
    return this.getColumns().filter(col => col.editable)
  }

  static getFilterableColumns(): ColumnDefinition[] {
    return this.getColumns().filter(col => col.filterable)
  }

  // Column Groups CRUD operations
  static getColumnGroups(): ColumnGroup[] {
    const stored = localStorage.getItem(this.GROUPS_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_COLUMN_GROUPS
      }
    }
    return DEFAULT_COLUMN_GROUPS
  }

  static saveColumnGroups(groups: ColumnGroup[]): void {
    localStorage.setItem(this.GROUPS_STORAGE_KEY, JSON.stringify(groups))
  }

  static addColumnGroup(group: Omit<ColumnGroup, 'id'>): ColumnGroup {
    const groups = this.getColumnGroups()
    const newGroup: ColumnGroup = {
      ...group,
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    groups.push(newGroup)
    this.saveColumnGroups(groups)
    return newGroup
  }

  static updateColumnGroup(id: string, updates: Partial<ColumnGroup>): ColumnGroup | null {
    const groups = this.getColumnGroups()
    const index = groups.findIndex(group => group.id === id)
    
    if (index === -1) return null
    
    groups[index] = { ...groups[index], ...updates }
    this.saveColumnGroups(groups)
    return groups[index]
  }

  static deleteColumnGroup(id: string): boolean {
    const groups = this.getColumnGroups()
    const filteredGroups = groups.filter(group => group.id !== id)
    
    if (filteredGroups.length === groups.length) return false
    
    // Also remove group reference from columns
    const columns = this.getColumns()
    const updatedColumns = columns.map(col => 
      col.group === id ? { ...col, group: undefined } : col
    )
    this.saveColumns(updatedColumns)
    
    this.saveColumnGroups(filteredGroups)
    return true
  }

  static getColumnsByGroup(): Record<string, ColumnDefinition[]> {
    const columns = this.getVisibleColumns()
    const groups = this.getColumnGroups()
    const result: Record<string, ColumnDefinition[]> = {}
    
    // Initialize groups
    groups.forEach(group => {
      result[group.id] = []
    })
    
    // Add ungrouped columns
    result['ungrouped'] = []
    
    // Distribute columns
    columns.forEach(column => {
      if (column.group && result[column.group]) {
        result[column.group].push(column)
      } else {
        result['ungrouped'].push(column)
      }
    })
    
    return result
  }

  // Validation
  static validateColumnData(columnId: string, value: any): { valid: boolean; message?: string } {
    const column = this.getColumns().find(col => col.id === columnId)
    if (!column) return { valid: true }
    
    // Required validation
    if (column.required && (value === null || value === undefined || value === '')) {
      return { valid: false, message: `${column.label} is required` }
    }
    
    // Type validation
    if (value !== null && value !== undefined && value !== '') {
      switch (column.type) {
        case 'number':
          if (isNaN(Number(value))) {
            return { valid: false, message: `${column.label} must be a number` }
          }
          break
        case 'date':
          if (isNaN(Date.parse(value))) {
            return { valid: false, message: `${column.label} must be a valid date` }
          }
          break
      }
    }
    
    // Custom validation
    if (column.validation && value !== null && value !== undefined && value !== '') {
      const numValue = Number(value)
      
      if (column.validation.min !== undefined && numValue < column.validation.min) {
        return { 
          valid: false, 
          message: column.validation.message || `${column.label} must be at least ${column.validation.min}` 
        }
      }
      
      if (column.validation.max !== undefined && numValue > column.validation.max) {
        return { 
          valid: false, 
          message: column.validation.message || `${column.label} must be at most ${column.validation.max}` 
        }
      }
      
      if (column.validation.pattern) {
        const regex = new RegExp(column.validation.pattern)
        if (!regex.test(String(value))) {
          return { 
            valid: false, 
            message: column.validation.message || `${column.label} format is invalid` 
          }
        }
      }
    }
    
    return { valid: true }
  }

  // Reset to defaults
  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.GROUPS_STORAGE_KEY)
  }

  // Export/Import column configuration
  static exportConfiguration(): string {
    return JSON.stringify({
      columns: this.getColumns(),
      groups: this.getColumnGroups(),
      version: '1.0',
      exportedAt: new Date().toISOString()
    })
  }

  static importConfiguration(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson)
      if (config.columns && config.groups) {
        this.saveColumns(config.columns)
        this.saveColumnGroups(config.groups)
        return true
      }
    } catch {
      return false
    }
    return false
  }
}

