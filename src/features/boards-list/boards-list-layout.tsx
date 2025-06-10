import React from 'react';

export function BoardsListLayout({
    header,
    filters,
    children
}:
    {
        header: React.ReactNode,
        filters: React.ReactNode,
        children: React.ReactNode
    }) {
    return (
        <div className="container mx-auto p-4 flex flex-col gap-6">
            {header}
            {filters}
            {children}
        </div>
    )
};

export function BoardsListLayoutHeader({
    title = 'Дошки',
    actions,
    description = ''
}:
    {
        title?: string,
        description?: string,
        actions: React.ReactNode
    }
) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold mb-6">{title}</h1>
                {description && <p className="text-gray-500">{description}</p>}
            </div>
            {actions}
        </div>
    )
};

export function BoardsListLayoutFilters({
    sort,
    filters,
    actions
}: {
    sort: React.ReactNode,
    filters: React.ReactNode,
    actions?: React.ReactNode
}) {
    return (
        <div className="flex items-center gap-4">
            {filters && (
                <div className='flex items-center gap-2'>
                    <div className='text-sm font-medium text-gray-700'>
                        Фільтри:
                        {filters}
                    </div>
                </div>
            )}

            {sort && (
                <div className='flex items-center gap-2'>
                    <div className='text-sm font-medium text-gray-700'>
                        Сортування:
                        {sort}
                    </div>
                </div>
            )}
            {actions && <div className="ml-auto">{actions}</div>}
        </div>
    )
};